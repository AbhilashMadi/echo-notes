import { responseHandler } from "@/utils/response.js";
import type { Next } from "hono";
import type { Context } from "vm";
import { ZodSchema, ZodError } from "zod";

export default (schema: ZodSchema) => {
  return async (c: Context, next: Next) => {
    try {
      // Parse and validate request body
      const body = await c.req.json();
      schema.parse(body);

      // Proceed if validation is successful
      return await next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Collect and return validation errors
        const messages = error.issues.map((issue) => issue.message);
        return c.json(responseHandler(false, 'Validation Error', null, { messages }));
      }

      // If not a validation error, rethrow it
      throw error;
    }
  };
};