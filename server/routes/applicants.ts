import { Router } from "express";
import {
  getApplicants,
  getApplicantById,
} from "../controllers/applicant.controller.js";

const router = Router();

router.get("/", getApplicants);
router.get("/:id", getApplicantById);

export default router;
