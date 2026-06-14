import type { Request, Response } from "express";
import { AuthServices } from "./auth.service";

const signUp = async (req: Request, res: Response) => {
    try {
        const authInfo = req.body;
        const result = await AuthServices.signUp(authInfo);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const authInfo = req.body;
        const result = await AuthServices.login(authInfo);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};

export const AuthControllers = {
    signUp,
    login,
};
