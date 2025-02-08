import { responseHandler } from "@/utils/response.js";
import type { Context } from 'hono';
import { StatusCodes } from "http-status-codes"

export default async (c: Context) => {
  return c.json(responseHandler(false, `${c.req.path} not found`), StatusCodes.NOT_FOUND);
}