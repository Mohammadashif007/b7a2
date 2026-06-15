import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { pool } from "../../db";

export const checkAuth =
    (...authRoles: any) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new Error("You are not authorized");
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

        const user = userData.rows[0];

        if (userData.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        if (!authRoles.length && !authRoles.includes(user.role)) {
            res.status(403).json({
                success: false,
                message: "Forbidden",
            });
        }

        req.user = verifyToken;

        next();
    };
