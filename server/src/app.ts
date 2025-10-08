import express, { Router } from "express";
import cors from "cors";
import helmet from "helmet";
import businessRoutes from "./routes/business.js";
import applicantRoutes from "./routes/applicants.js";
import applicationRoutes from "./routes/applications.js";
import jobRoutes from "./routes/jobs.js";

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

app.use("/api/v1", apiRouter);

export default app;
