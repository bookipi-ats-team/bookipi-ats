import { Router } from "express";
import {
  getApplicantById,
  getApplicants,
} from "../controllers/applicant.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  getApplicantByIdParamsSchema,
  getApplicantsQuerySchema,
} from "../validation/applicants.js";
import { validateAuth } from "../middleware/validateAuth.js";

const router = Router();

router.get(
  "/",
  validateAuth,
  validateRequest({ query: getApplicantsQuerySchema }),
  getApplicants,
);
router.get(
  "/:id",
  validateAuth,
  validateRequest({ params: getApplicantByIdParamsSchema }),
  getApplicantById,
);

export default router;
