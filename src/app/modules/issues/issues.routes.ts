import { Router } from "express";
import { IssuesControllers } from "./issues.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ROLES } from "../../../types";

const router = Router();

router.post(
    "/",
    checkAuth(ROLES.CONTRIBUTOR, ROLES.MAINTAINER),
    IssuesControllers.createIssues,
);

router.get("/", IssuesControllers.getAllIssues);
router.get("/:id", IssuesControllers.getSingleIssue);

export const IssuesRoutes = router;
