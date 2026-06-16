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

const getAllIssues = async () => {
    const result = await pool.query<IIssues>(`
    SELECT * FROM issues;
    `);
    const issues = result.rows;

    if (issues.length === 0) {
        return [];
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
    const updatedResult = await pool.query<IIssues>(
        `
        UPDATE issues 
        SET 
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            type = COALESCE($3, type),
            updated_at = NOW()
        WHERE id = $4
        RETURNING *
        `,
        [title, description, type, id],
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
