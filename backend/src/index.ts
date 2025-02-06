import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import cors from '@/config/cors.config.js'

import { envConfig } from "@/config/env.config.js";
import authRoutes from '@/routes/auth.route.js';

const app = new Hono()

//Global Middlewares
app.use(cors);

//API endpoinst entry
app.use("/api/v1")
app.route("/api/v1/auth", authRoutes);

//Server configuration
const port = envConfig.PORT
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
