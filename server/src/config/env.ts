import { config } from "dotenv";

config();

const parsePort = (value: string | undefined): number => {
  const parsed = Number.parseInt(value ?? "", 10);

  if (Number.isNaN(parsed)) {
    return 3000;
  }

  return parsed;
};

const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT),
  mongoUri: process.env.MONGODB_URI,
  maxResumeFileSize:
    Number(process.env.MAX_RESUME_FILE_SIZE) || 15 * 1024 * 1024,
  allowedResumeMimeTypes: new Set(
    process.env.ALLOWED_RESUME_MIME_TYPES?.split(",") || [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  ),
} as const;

export default env;
