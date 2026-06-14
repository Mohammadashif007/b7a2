import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { IssuesRoutes } from "../modules/issues/issues.routes";

export const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/issues",
        route: IssuesRoutes,
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
