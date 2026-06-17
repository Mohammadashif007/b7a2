import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { pool } from "../../db";


export const checkAuth =
    (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                res.status(401).json({
                    success: false,
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
                res.status(404).json({
                    success: false,
                    message: "User not found!",
                });
                return;
            }

            const user = userData.rows[0];

            if (authRoles.length && !authRoles.includes(user.role)) {
                res.status(403).json({
                    success: false,
                    message: "Forbidden",
                });
                return;
            }

            req.user = verifyToken;

            next();
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: "Invalid expired token",
                error: error.message,
            });
        }
    };
