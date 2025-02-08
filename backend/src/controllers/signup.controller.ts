import resendConfig from "@/config/resend.config.js";
import type { Context } from 'hono';

export default async (c: Context) => {
  const data = await resendConfig;
  return c.json(data);
}