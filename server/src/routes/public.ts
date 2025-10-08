import { Router } from "express";
import {
  getPublicApplications,
  getPublicJobById,
  getPublicJobs,
  postPublicApply,
} from "../controllers/public.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  getPublicApplicationsParamsSchema,
  getPublicJobParamsSchema,
  getPublicJobsQuerySchema,
  postPublicApplyBodySchema,
} from "../validation/public.js";

const router = Router();

router.get(
  "/jobs",
  validateRequest({ query: getPublicJobsQuerySchema }),
  getPublicJobs,
);

router.get(
  "/jobs/:jobId",
  validateRequest({ params: getPublicJobParamsSchema }),
  getPublicJobById,
);

router.post(
  "/apply",
  validateRequest({ body: postPublicApplyBodySchema }),
  postPublicApply,
);

router.get(
  "/applications/:email",
  validateRequest({ params: getPublicApplicationsParamsSchema }),
  getPublicApplications,
);

export default router;
