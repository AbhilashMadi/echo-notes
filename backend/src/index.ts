import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

// Middlewares
import cors from "@/config/cors.config.js";
import { connectDB } from "@/config/db.config.js";
// Connections and configurations
import { envConfig } from "@/config/env.config.js";
import authRoutes from "@/routes/auth.route.js";
import cdnRoutes from "@/routes/cdn.route.js";
import notesRoutes from "@/routes/notes.route.js";
// Route handlers(Controllers)
import { notFound, onError } from "@/utils/response.js";

export const app = new Hono({ strict: false });

// Database connections
connectDB();

// Global Middlewares
app.use(secureHeaders());
app.use(csrf({ origin: envConfig.FRONTEND_DOMAIN }));
app.use(cors);
app.use(logger());
app.use(prettyJSON());

// API endpoinst entry
app.route("/api/v1/auth", authRoutes);
app.route("/api/v1/notes", notesRoutes);
app.route("/api/v1/cdn", cdnRoutes);

app.onError(onError);
app.notFound(notFound);

// Server configuration
const port = envConfig.PORT;
// eslint-disable-next-line no-console
console.log(`Server is running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });
