import { Router } from "express";
import { createJob } from "../controllers/jobs.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createJobBodySchema } from "../validation/jobs.js";

const router = Router();

router.post("/", validateRequest({ body: createJobBodySchema }), createJob);

export default router;
