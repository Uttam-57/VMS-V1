/**
 * @file env.js
 * @description Configuration for config feature.
 */
import { z } from "zod";
import dotenv from "dotenv";
import path from "path"; // Load .env file

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  CLIENT_URL: z.string().default("http://localhost:5173"),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}
const env = _env.data;
export default env;
