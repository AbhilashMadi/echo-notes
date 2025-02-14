import { z } from "zod";

type Env = z.infer<typeof envSchema>;
const envSchema = z.object({
  VITE_BACKEND_URL: z
    .string()
    .min(1, "VITE_BACKEND_URL is missing from .env.${NODE_ENV}"),
});

let env: Env;

try {
  env = envSchema.parse(import.meta.env);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error("❌ Invalid environment variables:", error);
  throw new Error("Failed to load environment variables");
}

export default env;
