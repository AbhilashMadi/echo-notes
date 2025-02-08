import { responseHandler } from '@/utils/response.js';
import type { Context, Next } from 'hono';
import { ZodError } from 'zod';

import loginSchema from '@/validations/schemas/login.schema.js';
import signupSchema from './schemas/signup.schema.js';

export const validateLogin = async (c: Context, next: Next) => {
  try {
    // Parse the request body against the login schema
    const b = await c.req.json();
    loginSchema.parse(b);

    // Proceed if validation is successful
    await next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Collect all error messages
      const messages = error.issues.map((issue) => issue.message);
      // Return a formatted error response with a list of messages
      return c.json(responseHandler(false, 'Validation Error', null, { messages }));
    }

    // If not a Zod error, rethrow the error to be caught by global error handler
    throw error;
  }
};

export const validateSignup = async (c: Context, next: Next) => {
  try {
    // Parse the request body against the login schema
    const b = await c.req.json();
    signupSchema.parse(b);

    // Proceed if validation is successful
    await next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Collect all error messages
      const messages = error.issues.map((issue) => issue.message);
      // Return a formatted error response with a list of messages
      return c.json(responseHandler(false, 'Validation Error', null, { messages }));
    }

    // If not a Zod error, rethrow the error to be caught by global error handler
    throw error;
  }
}