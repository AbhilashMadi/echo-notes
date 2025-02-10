import { deleteFromCloudinary } from "@/lib/cloudinary.js";
import { responseHandler } from "@/utils/response.js";

import type { DeleteAssetDto } from "@/validations/schemas/cdn.schema.js";
import type { Context } from "hono";

export default async (c: Context) => {
  const { url } = await c.req.json<DeleteAssetDto>();
  const res = await deleteFromCloudinary(url);

  return c.json(responseHandler(res, ""));
}