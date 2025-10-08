import { Router } from "express";
import {
  confirmResumeUpload,
  signResumeUpload,
} from "../controllers/file.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  resumeConfirmBodySchema,
  resumeSignBodySchema,
} from "../validation/files.js";

const router = Router();

router.post(
  "/resume/sign",
  validateRequest({ body: resumeSignBodySchema }),
  signResumeUpload,
);

router.post(
  "/resume/confirm",
  validateRequest({ body: resumeConfirmBodySchema }),
  confirmResumeUpload,
);

export default router;
