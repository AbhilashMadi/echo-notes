import type { UploadApiResponse } from "cloudinary";

import stream from "node:stream";

import cloudinary from "@/config/cloudinary.config.js";

export function getPublicIdFromUrl(url: string): string | null {
  try {
    // Extracts part after `/v{version}/` and removes extension
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);

    return match ? match[1] : null;
  }
  catch (error) {
    throw new Error(`Error extracting public ID: ${url}`);
  }
}

export async function uploadToCloudinary(buffer: Buffer, fileName?: string, folder: string = "echo_notes"): Promise<UploadApiResponse> {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: fileName || undefined, // If no filename, Cloudinary auto-generates one
        resource_type: "auto", // Auto-detect (image, video, raw files)
        unique_filename: true, // Ensures unique names
        overwrite: false, // Avoid accidental overwrites
        format: "webp", // Convert to optimized format
        quality: "auto:eco", // Automatic quality adjustment for best optimization
        fetch_format: "auto", // Convert to best format (JPEG, WebP, AVIF)
        transformation: [
          { width: 800, height: 800, crop: "limit" }, // Resize to max 1024x1024
          { flags: "progressive" }, // Progressive rendering
          { dpr: "auto" }, // Adjust resolution based on device
          { effect: "sharpen" }, // Improve clarity after compression
        ],
      },
      (error, result) => {
        if (error)
          reject(error);
        else if (result)
          resolve(result);
        else reject(new Error("Upload failed with no error message"));
      },
    );

    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(uploadStream);
  }).then(result => result);
}

export async function deleteFromCloudinary(url: string): Promise<boolean> {
  const publicId = getPublicIdFromUrl(url)!;
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result === "ok") {
    console.log(`Successfully deleted: ${publicId}`);
    return true;
  }
  else {
    console.error(`🐞 Failed to delete: ${publicId} - ${result.result}`);
    return false;
  }
}
