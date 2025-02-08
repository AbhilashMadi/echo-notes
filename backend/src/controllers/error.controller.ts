import { responseHandler } from '@/utils/response.js';
import type { Context } from 'hono';

export default async (err: Error, c: Context) => {
  console.error('🔥 Server Error:', err);
  return c.json(responseHandler(false, 'Internal Server Error', null, { error: err.message }), 500);
}