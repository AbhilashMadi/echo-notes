import { z } from "zod";

export const verifyFieldSchema = z.object({ field: z.enum(["email"]) });
export const verifyOtpSchema = z.object({ otp: z.string().length(6, { message: "OTP is required" }) });