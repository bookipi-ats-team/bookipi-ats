import { Router } from "express";
import { createJob, getJobById } from "../controllers/jobs.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createJobBodySchema, jobIdParamsSchema } from "../validation/jobs.js";

const router = Router();

router.post("/", validateRequest({ body: createJobBodySchema }), createJob);
router.get(
  "/:id",
  validateRequest({ params: jobIdParamsSchema }),
  getJobById,
);

export default router;
