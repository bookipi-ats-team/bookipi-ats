import { Router } from "express";
import {
  getMyBusiness,
  createBusiness,
  updateBusiness,
} from "../controllers/business.controller.js";

const router = Router();

router.get("/my", getMyBusiness);
router.post("/", createBusiness);
router.patch("/:id", updateBusiness);

export default router;
