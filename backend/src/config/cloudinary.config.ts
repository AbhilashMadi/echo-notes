import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "@/config/env.config.js";

cloudinary.config({
    cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
    api_key: envConfig.CLOUDINARY_API_KEY,
    api_secret: envConfig.CLOUDINARY_SECRET_KEY,
    secure: true, // Ensure HTTPS URLs
});

export default cloudinary;
