import { z } from "zod";

// Field verification schema
export const verifyFieldSchema = z.object({
  field: z.enum(["email"], {
    message: "Invalid field value. Only 'email' is allowed.",
  }),
});

// OTP verification schema
export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits long." })
    .regex(/^\d+$/, { message: "OTP must contain only numeric digits." }),
});
