import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  // Server environment
  NODE_ENV: z.enum(["development", "production"]),

  // Organization Details
  ORG_NAME: z.string().min(1, "ORG_NAME is required"),
  ORG_EMAIL: z.string().email("ORG_EMAIL must be a valid email"),

  // Database Configuration
  MONGO_DB_URI: z.string().min(1, "MONGO_DB_URI is required"),
  DB_NAME: z.string().default("echo-notes"),

  // CORS Configuration
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required"),

  // Server Configuration
  PORT: z.coerce.number().positive("PORT must be a positive number"),

  // Domain Configuration
  FRONTEND_DOMAIN: z.string().url("FRONTEND_DOMAIN must be a valid URL"),
  BACKEND_DOMAIN: z.string().url("BACKEND_DOMAIN must be a valid URL"),

  // Token Secrets and Expiration
  ACCESS_TOKEN_SECRET: z.string().min(1, "ACCESS_TOKEN_SECRET is required"),
  REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
  ACCESS_TOKEN_EXP: z.string().default("15m"),
  REFRESH_TOKEN_EXP: z.string().default("7d"),

  PROJECT_KEY_GENERATION_SECRET: z
    .string()
    .min(1, "PROJECT_KEY_GENERATION_SECRET is required"),

  VERIFICATION_TOKEN_SECRET: z
    .string()
    .min(1, "VERIFICATION_TOKEN_SECRET is required"),
  VERIFICATION_TOKEN_EXP: z.string().default("15m"),

  RESET_PASSWORD_TOKEN_SECRET: z
    .string()
    .min(1, "RESET_PASSWORD_TOKEN_SECRET is required"),
  RESET_PASSWORD_TOKEN_EXP: z.string().default("15m"),

  MAGIC_URL_TOKEN_SECRET: z
    .string()
    .min(1, "MAGIC_URL_TOKEN_SECRET is required"),
  MAGIC_URL_TOKEN_EXP: z.string().default("15m"),

  // Resend API Configuration
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
});

// Validate the environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "☠️ Invalid environment configuration:",
    JSON.stringify(parsedEnv.error.format(), null, 2)
  );
  process.exit(1); // Exit the app if validation fails
}

export const envConfig = parsedEnv.data;
