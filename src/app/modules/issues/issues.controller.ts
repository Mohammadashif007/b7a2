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
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: error.message,
            errors: error.message,
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
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issue retrieve successfully",
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: error.message,
            errors: error.message,
        });
    }
};

const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const issueId = req.params.id as string;
        const result = await IssuesServices.getSingleIssue(issueId);
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issue retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        const statusCode =
            error.message === "Issue not found"
                ? StatusCodes.NOT_FOUND
                : StatusCodes.BAD_REQUEST;
        sendResponse(res, {
            statusCode: statusCode,
            success: false,
            message: error.message,
            errors: error.message,
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
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issue updated successfully",
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: error.message,
            errors: error.message,
        });
    }
};

const deleteIssue = async (req: Request, res: Response) => {
    try {
        const issueId = req.params.id as string;
        await IssuesServices.deleteIssue(issueId);
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issue deleted successfully",
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: error.message,
            errors: error.message,
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
