import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env"),
});

export const config = {
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
    JWT_SECRET: process.env.JWT_SECRET,
};
