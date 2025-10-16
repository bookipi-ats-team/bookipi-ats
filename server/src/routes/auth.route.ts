import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginBodySchema } from "../validation/auth.js";

const router = Router();

router.post("/login", validateRequest({ body: loginBodySchema }), login);

export default router;
