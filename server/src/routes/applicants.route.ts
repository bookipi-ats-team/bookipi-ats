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

const router = Router();

router.get(
  "/",
  validateRequest({ query: getApplicantsQuerySchema }),
  getApplicants,
);
router.get(
  "/:id",
  validateRequest({ params: getApplicantByIdParamsSchema }),
  getApplicantById,
);

export default router;
