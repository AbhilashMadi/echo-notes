import { responseHandler } from '@/utils/response.js';
import type { Context } from 'hono';
import { StatusCodes } from "http-status-codes"

export default async (err: Error, c: Context) => {
  console.error('🔥 Server Error:', err);
  return c.json(responseHandler(false, 'Internal Server Error', null, { error: err.message }), StatusCodes.INTERNAL_SERVER_ERROR);
}