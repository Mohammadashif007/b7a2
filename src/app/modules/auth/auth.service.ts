import { initDB, pool } from "../../../db";
import { config } from "../../config";
import type { IAuth, IUser } from "./auth.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signUp = async (payload: IAuth) => {
    console.log(payload);
    const { name, email, password, role } = payload;
    const hashedPass = await bcrypt.hash(
        password,
        Number(config.BCRYPT_SALT_ROUND),
    );
    const result = await pool.query<IUser>(
        `
            INSERT INTO users(name, email, password, role)
            VALUES($1,$2,$3, COALESCE($4, 'contributor'))
            RETURNING *
        `,
        [name, email, hashedPass, role],
    );

    const user = result.rows[0];
    if (!user) {
        throw new Error("User creation failed");
    }
    const { password: _, ...rest } = user;
    return rest;
};

const login = async (payload: Partial<IAuth>) => {
    const { email, password } = payload;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const result = await pool.query(
        `
        SELECT * FROM users WHERE email = $1
        `,
        [email],
    );
    const user = result.rows[0];

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password as string, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
    };

    const generateToken = jwt.sign(
        jwtPayload,
        config.JWT_SECRET as string,
        { expiresIn: "1d" },
    );

    const { password: _, ...rest } = user;

    return { token: generateToken, user: rest };
};

export const AuthServices = {
    signUp,
    login,
};
