import { type Context } from 'hono';

export default async (c: Context) => {
  console.log(c);
  return c.json('hi');
}