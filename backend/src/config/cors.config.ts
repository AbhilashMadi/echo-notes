import { cors } from "hono/cors";

import { envConfig } from "@/config/env.config.js";

export default cors({
  origin: envConfig.CORS_ORIGIN,
  allowHeaders: [
    "X-Custom-Header",
    "Upgrade-Insecure-Requests",
    "Content-Type",
    "Authorization",
  ],
  allowMethods: ["POST", "GET", "PATCH", "DELETE", "PUT", "OPTIONS"],
  exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
  maxAge: 600,
  credentials: true,
});
