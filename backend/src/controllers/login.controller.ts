import { type Context } from 'hono';

export default async (c: Context) => {
  try {
    return c.json(c.req.blob);
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}