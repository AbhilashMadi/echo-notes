import type { Context } from 'hono';

export default async (c: Context) => {
  return c.json({ a: "signUp" });
}