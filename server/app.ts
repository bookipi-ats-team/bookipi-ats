import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// TODO: register routes under /api/v1 when implemented

export default app;
