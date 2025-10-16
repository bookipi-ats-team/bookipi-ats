import { Router, type RequestHandler } from "express";
import {
  createBusiness,
  getMyBusiness,
  updateBusiness,
} from "../controllers/business.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createBusinessBodySchema,
  updateBusinessBodySchema,
  updateBusinessParamsSchema,
} from "../validation/business.js";

const router = Router();

const mergeQueryIntoBody: RequestHandler = (req, _res, next) => {
  req.body = { ...req.query, ...req.body };
  next();
};

router.get("/my", getMyBusiness);
router.post(
  "/",
  mergeQueryIntoBody,
  validateRequest({ body: createBusinessBodySchema }),
  createBusiness,
);
router.patch(
  "/:id",
  validateRequest({
    params: updateBusinessParamsSchema,
    body: updateBusinessBodySchema,
  }),
  updateBusiness,
);

export default router;
