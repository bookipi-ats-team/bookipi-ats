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
} as const;

export default env;
