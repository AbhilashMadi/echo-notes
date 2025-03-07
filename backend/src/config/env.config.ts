import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  // Server environment
  NODE_ENV: z.enum(["development", "production"]),

  // Organization Details
  ORG_NAME: z.string().min(1, "ORG_NAME is required"),

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
  ACCESS_TOKEN_EXP: z.string(),
  REFRESH_TOKEN_EXP: z.string(),

  PROJECT_KEY_GENERATION_SECRET: z
    .string()
    .min(1, "PROJECT_KEY_GENERATION_SECRET is required"),

  VERIFICATION_TOKEN_SECRET: z
    .string()
    .min(1, "VERIFICATION_TOKEN_SECRET is required"),
  VERIFIICATION_TOKEN_EXP: z.string(),

  RESET_PASSWORD_TOKEN_SECRET: z
    .string()
    .min(1, "RESET_PASSWORD_TOKEN_SECRET is required"),
  RESET_PASSWORD_TOKEN_EXP: z.string(),

  MAGIC_URL_TOKEN_SECRET: z
    .string()
    .min(1, "MAGIC_URL_TOKEN_SECRET is required"),
  MAGIC_URL_TOKEN_EXP: z.string(),

  // SMTP Server Credentials
  GOOGLE_SMTP_USER: z.string()
    .min(1, "ZOHO_SMTP_USER is missing"),

  GOOGLE_SMTP_PASSWORD: z.string()
    .min(1, "ZOHO_SMTP_PASSWORD is missing"),

  // CDN Credentials
  CLOUDINARY_CLOUD_NAME: z.string()
    .min(1, "CLOUDINARY_CLOUD_NAME is missing from env"),
  CLOUDINARY_API_KEY: z.string()
    .min(1, "CLOUDINARY_API_KEY is missing from env"),
  CLOUDINARY_SECRET_KEY: z.string()
    .min(1, "CLOUDINARY_SECRET_KEY is missing from env"),
});

// Validate the environment variables

// eslint-disable-next-line node/no-process-env
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "☠️ Invalid environment configuration:",
    JSON.stringify(parsedEnv.error.format(), null, 2),
  );

  process.exit(1); // Exit the app if validation fails
}

export const envConfig = parsedEnv.data;
