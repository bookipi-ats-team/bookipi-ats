import cors from "cors";
import express, { Router } from "express";
import "express-async-errors";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import { validateAuth } from "./middleware/validateAuth.js";
import aiRoutes from "./routes/api/ai.route.js";
import applicantRoutes from "./routes/api/applicants.route.js";
import applicationRoutes from "./routes/api/applications.route.js";
import businessRoutes from "./routes/api/business.route.js";
import filesRoutes from "./routes/api/files.route.js";
import jobRoutes from "./routes/api/jobs.route.js";
import authRoutes from "./routes/auth.route.js";
import publicRoutes from "./routes/public.route.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const apiRouter = Router();

apiRouter.use("/business", businessRoutes);
apiRouter.use("/applicants", applicantRoutes);
apiRouter.use("/", applicationRoutes);
apiRouter.use("/jobs", jobRoutes);
apiRouter.use("/ai", aiRoutes);
apiRouter.use("/files", filesRoutes);

app.use("/public", publicRoutes);
app.use("/auth", authRoutes);
app.use("/api/v1", validateAuth, apiRouter);

// WARN: Global error handler (must be last)
app.use(errorHandler);

export default app;
