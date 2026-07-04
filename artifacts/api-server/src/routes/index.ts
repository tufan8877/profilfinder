import { Router, type IRouter } from "express";
import healthRouter from "./health";
import debugRouter from "./debug";
import authRouter from "./auth";
import profilesRouter from "./profiles";
import companyRequestsRouter from "./company-requests";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(debugRouter);
router.use(authRouter);
router.use(profilesRouter);
router.use(companyRequestsRouter);
router.use(adminRouter);

export default router;
