import express, { Router } from "express";
import cors from "cors";
import helmet from "helmet";
import businessRoutes from "./routes/business.route.js";
import applicantRoutes from "./routes/applicants.route.js";
import applicationRoutes from "./routes/applications.route.js";
import jobRoutes from "./routes/jobs.route.js";
import aiRoutes from "./routes/ai.route.js";
import filesRoutes from "./routes/files.route.js";
import publicRoutes from "./routes/public.route.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const apiRouter = Router();

apiRouter.use("/public", publicRoutes);
apiRouter.use("/business", businessRoutes);
apiRouter.use("/applicants", applicantRoutes);
apiRouter.use("/", applicationRoutes);
apiRouter.use("/jobs", jobRoutes);
apiRouter.use("/ai", aiRoutes);
apiRouter.use("/files", filesRoutes);

app.use("/api/v1", apiRouter);

export default app;
