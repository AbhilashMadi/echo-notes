import { z } from "zod";

import { Regex } from "@/resources/regex.resource.js";

const signupSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^\w+$/, "Username can only contain letters, numbers, and underscores"),

  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(Regex.PASSWORD, { message: "Password must have at least one uppercase letter, one lowercase letter, one number and one special character" }),

  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine(data => data.email.toLowerCase() !== data.password.toLowerCase(), { // <-- The crucial addition
  message: "Password cannot be the same as email",
  path: ["password"],
});

export type SignupSchema = z.infer<typeof signupSchema>;
export default signupSchema;
