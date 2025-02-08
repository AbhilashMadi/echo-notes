import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger';
import cors from '@/config/cors.config.js'
import { prettyJSON } from 'hono/pretty-json';

import { envConfig } from '@/config/env.config.js';

import authRoutes from '@/routes/auth.route.js';
import errorController from '@/controllers/error.controller.js';
import notfoundController from "@/controllers/notfound.controller.js";

export const app = new Hono({ strict: false });

//Global Middlewares
app.use(cors);
app.use(logger());
app.use(prettyJSON());

//API endpoinst entry
app.route('/api/v1/auth', authRoutes);

app.onError(errorController);
app.notFound(notfoundController);

//Server configuration
const port = envConfig.PORT
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
