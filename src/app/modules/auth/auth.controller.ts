import type { Request, Response } from "express";
import { AuthServices } from "./auth.service";
import sendResponse from "../../utility/sendResponse";
import { StatusCodes } from "http-status-codes";

const signUp = async (req: Request, res: Response) => {
    try {
        const authInfo = req.body;
        const result = await AuthServices.signUp(authInfo);
        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "User registered successfully",
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

const login = async (req: Request, res: Response) => {
    try {
        const authInfo = req.body;
        const result = await AuthServices.login(authInfo);
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Login successful",
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

export const AuthControllers = {
    signUp,
    login,
};
