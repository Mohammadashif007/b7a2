import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../../db";
import type { IIssues } from "./issues.interface";

const createIssues = async (payload: IIssues, user: JwtPayload) => {
    const { title, description, type } = payload;

    const result = await pool.query<IIssues>(
        `
        INSERT INTO issues(title, description, type, reporter_id)
        VALUES($1, $2, $3, $4)
        RETURNING *
        `,
        [title, description, type, user.id],
    );

    const issue = result.rows[0];
    if (!issue) {
        throw new Error("Issue creation failed");
    }
    return issue;
};

const getAllIssues = async (sort?: string, type?: string, status?: string) => {
    const sortOrder = sort === "oldest" ? "ASC" : "DESC";

    const conditions: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (type) {
        conditions.push(`type = $${paramCount}`);
        values.push(type);
        paramCount++;
    }

    if (status) {
        conditions.push(`status = $${paramCount}`);
        values.push(status);
        paramCount++;
    }

    const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query<IIssues>(
        `
    SELECT * FROM issues ${whereClause} ORDER BY created_at ${sortOrder};
    `,
        values,
    );

    const issues = result.rows;

    if (issues.length === 0) {
        throw new Error("Issue not found");
    }

    const reporterIds = issues.map((issue) => issue.reporter_id);

    const ids = [...new Set(reporterIds)];

    let reporters: { id: number; name: string; role: string }[] = [];

    if (ids.length > 0) {
        const reportersResult = await pool.query(
            `
            SELECT id, name, role FROM users WHERE id = ANY($1)
            `,
            [ids],
        );
        reporters = reportersResult.rows;
    }

    const issuesWithReporter = issues.map((issue) => {
        const { reporter_id, created_at, updated_at, ...rest } = issue;
        const reporter = reporters.find((r) => r.id === reporter_id);
        return { ...rest, reporter, created_at, updated_at };
    });

    return issuesWithReporter;
};

const getSingleIssue = async (id: string) => {
    const result = await pool.query<IIssues>(
        `
        SELECT * FROM issues WHERE id = $1
        `,
        [id],
    );
    const issue = result.rows[0];

    if (!issue) {
        throw new Error("Issue not found");
    }

    const { reporter_id, created_at, updated_at, ...rest } = issue;

    let reporter = null;
    if (reporter_id) {
        const reporterInfo = await pool.query(
            `
            SELECT id, name, role FROM users WHERE id = $1
            `,
            [reporter_id],
        );
        reporter = reporterInfo.rows[0];
    }
    return { ...rest, reporter, created_at, updated_at };
};

const updateIssue = async (
    id: string,
    payload: Partial<IIssues>,
    user: JwtPayload,
) => {
    const issueResult = await pool.query(
        `
        SELECT * FROM issues WHERE id = $1
        `,
        [id],
    );

    const issue = issueResult.rows[0];
    if (!issue) {
        throw new Error("Issue not found");
    }

    if (user.role === "contributor") {
        if (issue.reporter_id !== user.id) {
            throw new Error("You can only update your own issue");
        }
        if (issue.status !== "open") {
            throw new Error("You can only update issues with status open");
        }
    }

    const { title, description, type } = payload;

    const status = user.role === "maintainer" ? payload.status : undefined;

    const updatedResult = await pool.query<IIssues>(
        `
        UPDATE issues 
        SET 
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            type = COALESCE($3, type),
            status = COALESCE($4, status),
            updated_at = NOW()
        WHERE id = $5
        RETURNING *
        `,
        [title, description, type, status, id],
    );

    const updatedIssue = updatedResult.rows[0];
    if (!updatedIssue) {
        throw new Error("Issue update failed");
    }
    return updatedIssue;
};

const deleteIssue = async (id: string) => {
    const issueResult = await pool.query<IIssues>(
        `
        SELECT * FROM issues WHERE id = $1
        `,
        [id],
    );

    const issue = issueResult.rows[0];

    if (!issue) {
        throw new Error("Issue not found");
    }

    await pool.query(
        `
        DELETE FROM issues WHERE id = $1
        `,
        [id],
    );
};

export const IssuesServices = {
    createIssues,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
};
