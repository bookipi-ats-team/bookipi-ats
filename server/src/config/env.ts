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
  openAiApiKey: process.env.OPENAI_API_KEY,
  model: process.env.MODEL || "gpt-4o-mini",
  maxResumeFileSize:
    Number(process.env.MAX_RESUME_FILE_SIZE) || 15 * 1024 * 1024,
  allowedResumeMimeTypes: new Set(
    process.env.ALLOWED_RESUME_MIME_TYPES?.split(",") || [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  ),
  googleDriveCredentialsBase64: process.env.GOOGLE_DRIVE_CREDENTIALS_BASE64,
  googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
  googleDriveImpersonatedUser: process.env.GOOGLE_DRIVE_IMPERSONATED_USER,
} as const;

export default env;
