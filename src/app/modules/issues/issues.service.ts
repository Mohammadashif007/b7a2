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
    console.log(issue);
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
        console.log(reporters);
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

export const IssuesServices = {
    createIssues,
    getAllIssues,
    getSingleIssue,
};
