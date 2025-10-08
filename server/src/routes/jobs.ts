import { Router } from "express";
import {
  createJob,
  getJobById,
  publishJob,
  pauseJob,
  closeJob,
} from "../controllers/jobs.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createJobBodySchema, jobIdParamsSchema } from "../validation/jobs.js";

const router = Router();

router.post("/", validateRequest({ body: createJobBodySchema }), createJob);
router.get(
  "/:id",
  validateRequest({ params: jobIdParamsSchema }),
  getJobById,
);
router.post(
  "/:id/publish",
  validateRequest({ params: jobIdParamsSchema }),
  publishJob,
);
router.post(
  "/:id/pause",
  validateRequest({ params: jobIdParamsSchema }),
  pauseJob,
);
router.post(
  "/:id/close",
  validateRequest({ params: jobIdParamsSchema }),
  closeJob,
);

export default router;
