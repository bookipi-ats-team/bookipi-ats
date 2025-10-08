import { Router, raw } from "express";
import {
  confirmResumeUpload,
  signResumeUpload,
  uploadResumeFile,
} from "../controllers/file.controller.js";
import env from "../config/env.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  resumeConfirmBodySchema,
  resumeSignBodySchema,
  resumeUploadParamsSchema,
} from "../validation/files.js";

const router = Router();

router.post(
  "/resume/sign",
  validateRequest({ body: resumeSignBodySchema }),
  signResumeUpload,
);

router.put(
  "/resume/upload/:fileId",
  raw({ type: "*/*", limit: env.maxResumeFileSize }),
  validateRequest({ params: resumeUploadParamsSchema }),
  uploadResumeFile,
);

router.post(
  "/resume/confirm",
  validateRequest({ body: resumeConfirmBodySchema }),
  confirmResumeUpload,
);

export default router;
