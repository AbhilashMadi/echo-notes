import cloudinary from "@/config/cloudinary.config.js";
import { uploadToCloudinary } from "@/lib/cloudinary.js";
import { responseHandler } from "@/utils/response.js";
import type { Context } from "hono";

export default async (c: Context) => {
  // Parse the file from the request body
  const body = await c.req.parseBody();
  const image = body["image"] as File;

  if (!image) {
    return c.json({ success: false, message: "No image file provided" }, 400);
  }

  // Get userId from request context
  const { userId } = c.get("user");

  // Convert file to buffer
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Uniq filename
  const fileName = `${userId}_${Date.now()}`

  // Check if Cloudinary is defined before using it
  if (!cloudinary || !cloudinary.uploader || !cloudinary.uploader.upload_stream) {
    throw new Error("Cloudinary instance is not initialized properly");
  }

  // Upload image to Cloudinary
  const uploadResult = await uploadToCloudinary(buffer, fileName);

  return c.json(responseHandler(true, "Image uploaded successfully", uploadResult));
}


/* FOLDER CONSOLE
https://console.cloudinary.com/console/c-76a3ef10269a925515e90350e3f99c/media_library/search?cld-target-product=digital_asset_management&q=&view_mode=mosaic
*/