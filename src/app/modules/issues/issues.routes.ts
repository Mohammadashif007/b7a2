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
router.patch(
    "/:id",
    checkAuth(ROLES.MAINTAINER, ROLES.CONTRIBUTOR),
    IssuesControllers.updateIssue,
);
router.delete(
    "/:id",
    checkAuth(ROLES.MAINTAINER),
    IssuesControllers.deleteIssue,
);

export const IssuesRoutes = router;
