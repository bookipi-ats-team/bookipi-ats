import { config } from "dotenv";
import { z } from "zod";

config();

const DEFAULT_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  MODEL: z.string().default("gpt-4o-mini"),
  MAX_RESUME_FILE_SIZE: z.coerce.number().default(15 * 1024 * 1024),
  ALLOWED_RESUME_MIME_TYPES: z.string().optional(),
  AUTH_MODULE_SERVER_URL: z.string(),
  GOOGLE_DRIVE_CREDENTIALS_BASE64: z.string().optional(),
  GOOGLE_DRIVE_FOLDER_ID: z.string().optional(),
  GOOGLE_DRIVE_IMPERSONATED_USER: z.string().optional(),
  JWT_SECRET: z.string(),
  JWT_EXPIRY_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(60 * 60 * 24 * 7),
});

const parsed = schema.parse(process.env);

const allowedResumeMimeTypes = new Set(
  parsed.ALLOWED_RESUME_MIME_TYPES
    ? parsed.ALLOWED_RESUME_MIME_TYPES.split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : DEFAULT_ALLOWED_MIME_TYPES,
);

const env = {
  nodeEnv: parsed.NODE_ENV,
  port: parsed.PORT,
  mongoUri: parsed.MONGODB_URI,
  openAiApiKey: parsed.OPENAI_API_KEY,
  model: parsed.MODEL,
  maxResumeFileSize: parsed.MAX_RESUME_FILE_SIZE,
  allowedResumeMimeTypes,
  authModule: {
    serverUrl: parsed.AUTH_MODULE_SERVER_URL,
  },
  googleDriveCredentialsBase64: parsed.GOOGLE_DRIVE_CREDENTIALS_BASE64,
  googleDriveFolderId: parsed.GOOGLE_DRIVE_FOLDER_ID,
  googleDriveImpersonatedUser: parsed.GOOGLE_DRIVE_IMPERSONATED_USER,
  jwtSecret: parsed.JWT_SECRET,
  jwtExpirySeconds: parsed.JWT_EXPIRY_SECONDS,
} as const;

export default env;
