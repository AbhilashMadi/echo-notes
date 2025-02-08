import { Hono } from 'hono';

import {
  validateLogin,
  validateSignup,
} from '@/validations/auth.validation.js';

import loginController from '@/controllers/login.controller.js';
import signupController from '@/controllers/signup.controller.js';

const useRouter = new Hono();

useRouter.post('/login', validateLogin, loginController);
useRouter.post('/signup', validateSignup, signupController);

export default useRouter;