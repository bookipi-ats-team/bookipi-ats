import { config } from 'dotenv';

config();

const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number.parseInt(process.env.PORT ?? '3000', 10)
};

export default env;
