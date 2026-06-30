import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { pool } from "../../db";
import sendResponse from "../utility/sendResponse";
import { StatusCodes } from "http-status-codes";

export const checkAuth =
    (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                
                sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.UNAUTHORIZED,
                    message: "You are not authorized",
                });
                return;
            }

            const verifyToken = jwt.verify(
                accessToken,
                config.JWT_SECRET as string,
            ) as JwtPayload;

            const userData = await pool.query(
                `
                SELECT * FROM users WHERE id = $1
                `,
                [verifyToken.id],
            );

            if (userData.rows.length === 0) {
                // res.status(404).json({
                //     success: false,
                //     message: "User not found!",
                // });
                sendResponse(res, {
                    statusCode: StatusCodes.UNAUTHORIZED,
                    success: false,
                    message: "User not found!",
                });
                return;
            }

            const user = userData.rows[0];

            if (authRoles.length && !authRoles.includes(user.role)) {
                // res.status(403).json({
                //     success: false,
                //     message: "You are not authorized",
                // });
                sendResponse(res, {
                    statusCode: StatusCodes.FORBIDDEN,
                    success: false,
                    message: "You are not authorized",
                });
                return;
            }

            req.user = verifyToken;

            next();
        } catch (error: any) {
            sendResponse(res, {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Invalid expired token",
                errors: error.message,
            });
        }
    };
