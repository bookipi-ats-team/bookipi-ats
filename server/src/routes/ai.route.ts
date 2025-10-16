import { Router } from "express";
import {
  postGenerateJobDescription,
  postScoreResume,
  postSuggestJobTitles,
  postSuggestMustHaves,
} from "../controllers/ai.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  generateJobDescriptionBodySchema,
  scoreResumeBodySchema,
  suggestJobTitlesBodySchema,
  suggestMustHavesBodySchema,
} from "../validation/ai.js";

const router = Router();

router.post(
  "/suggest-job-titles",
  validateRequest({ body: suggestJobTitlesBodySchema }),
  postSuggestJobTitles,
);

router.post(
  "/suggest-must-haves",
  validateRequest({ body: suggestMustHavesBodySchema }),
  postSuggestMustHaves,
);

router.post(
  "/generate-jd",
  validateRequest({ body: generateJobDescriptionBodySchema }),
  postGenerateJobDescription,
);

router.post(
  "/score-resume",
  validateRequest({ body: scoreResumeBodySchema }),
  postScoreResume,
);

export default router;
