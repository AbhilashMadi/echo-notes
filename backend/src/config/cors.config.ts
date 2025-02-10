import { cors } from "hono/cors";

// CORS Configuration
export default cors({
  origin: "http://example.com",
  allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
  maxAge: 600,
  credentials: true,
});
