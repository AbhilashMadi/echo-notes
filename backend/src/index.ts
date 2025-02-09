import cors from '@/config/cors.config.js';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import { envConfig } from '@/config/env.config.js';

import authRoutes from '@/routes/auth.route.js';
import { notFound, onError } from "@/utils/response.js";
import { connectDB } from "./config/db.config.js";
import { sendEmail } from "./config/email-client.config.js";

export const app = new Hono({ strict: false });

//Database connections
connectDB();

//Global Middlewares
app.use(cors);
app.use(logger());
app.use(prettyJSON());

//API endpoinst entry
app.route('/api/v1/auth', authRoutes);

app.onError(onError);
app.notFound(notFound);

//Server configuration
const port = envConfig.PORT
console.log(`Server is running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })
