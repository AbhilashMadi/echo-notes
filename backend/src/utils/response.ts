import type { Context } from 'hono';
import { StatusCodes } from "http-status-codes";
// Standard response handler
export const responseHandler = (success: boolean, message: string, data: any = null, error: any = null) => {
  return { success, message, data, error };
};

export const onError = async (err: Error, c: Context) => {
  console.error('🔥 Server Error:', err);

  return c.json(responseHandler(false, 'Internal Server Error', null, { error: err.message }), StatusCodes.INTERNAL_SERVER_ERROR);
}

export const notFound = (c: Context) => {
  return c.json(responseHandler(false, `${c.req.path} not found`), StatusCodes.NOT_FOUND);
}
