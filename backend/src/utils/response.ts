import type { Context } from "hono";

import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

// Standard response handler
export function responseHandler(success: boolean, message: string, data: any = null, error: any = null) {
  return { success, message, data, error };
}

export async function onError(err: Error, c: Context) {
  console.error("🔥 Server Error:", err);

  if (err instanceof ZodError) {
    // Collect and return validation errors
    const messages = err.issues.map(issue => issue.message);
    return c.json(responseHandler(false, "Validation Error", null, { messages }), StatusCodes.BAD_REQUEST);
  }

  return c.json(responseHandler(false, "Internal Server Error", null, { error: err.message }), StatusCodes.INTERNAL_SERVER_ERROR);
}

export function notFound(c: Context) {
  return c.json(responseHandler(false, `${c.req.path} not found`), StatusCodes.NOT_FOUND);
}
