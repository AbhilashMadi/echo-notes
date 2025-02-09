import { Hono } from 'hono';

import loginController from '@/controllers/login.controller.js';
import signupController from '@/controllers/signup.controller.js';
import verifyOtpController from "@/controllers/verify-otp.controller.js";

import loginSchema from "@/validations/schemas/login.schema.js";
import signupSchema from "@/validations/schemas/signup.schema.js";
import validateRequestDto from "@/validations/validate-request-dto.js";

const useRouter = new Hono();

useRouter.post('/login', validateRequestDto(loginSchema), loginController);
useRouter.post('/signup', validateRequestDto(signupSchema), signupController);
useRouter.post('/verify/:field', verifyOtpController);

export default useRouter;