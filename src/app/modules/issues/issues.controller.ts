import type { Request, Response } from "express";
import { IssuesServices } from "./issues.service";
import type { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utility/sendResponse";
import { StatusCodes } from "http-status-codes";

const createIssues = async (req: Request, res: Response) => {
    try {
        const result = await IssuesServices.createIssues(
            req.body,
            req.user as JwtPayload,
        );

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "Issues created successfully",
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};

const getAllIssues = async (req: Request, res: Response) => {
    try {
        const { sort, type, status } = req.query;
        const result = await IssuesServices.getAllIssues(
            sort as string,
            type as string,
            status as string,
        );
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue retrieve successfully",
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};

const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const issueId = req.params.id as string;
        const result = await IssuesServices.getSingleIssue(issueId);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};

const updateIssue = async (req: Request, res: Response) => {
    try {
        const issueId = req.params.id as string;
        const result = await IssuesServices.updateIssue(
            issueId,
            req.body,
            req.user as JwtPayload,
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};

const deleteIssue = async (req: Request, res: Response) => {
    try {
        const issueId = req.params.id as string;
        await IssuesServices.deleteIssue(issueId);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully",
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};

export const IssuesControllers = {
    createIssues,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
};
