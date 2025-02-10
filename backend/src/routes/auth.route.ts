import { Hono } from "hono";

import loginController from "@/controllers/auth/login.controller.js";
import refreshTokenController from "@/controllers/auth/refresh-token.controller.js";
import signupController from "@/controllers/auth/signup.controller.js";
import verifyOtpController from "@/controllers/auth/verify-otp.controller.js";
import loginSchema from "@/validations/schemas/login.schema.js";
import signupSchema from "@/validations/schemas/signup.schema.js";
import { verifyFieldSchema, verifyOtpSchema } from "@/validations/schemas/verify-otp.schema.js";
import validateRequestDto from "@/validations/validate-request-dto.js";

const useRouter = new Hono();

useRouter.post("/login", validateRequestDto(loginSchema), loginController);
useRouter.post("/signup", validateRequestDto(signupSchema), signupController);
useRouter.post("/verify/:field", validateRequestDto(verifyOtpSchema, undefined, verifyFieldSchema), verifyOtpController);
useRouter.post("/refresh-token", refreshTokenController);

export default useRouter;
