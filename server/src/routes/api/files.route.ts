import { Router, raw } from "express";
import env from "../../config/env.js";
import { uploadResume } from "../../controllers/file.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { resumeUploadQuerySchema } from "../../validation/files.js";

const router = Router();

router.post(
  "/resume/uploads",
  raw({ type: "*/*", limit: env.maxResumeFileSize }),
  validateRequest({ query: resumeUploadQuerySchema }),
  uploadResume,
);

export default router;
