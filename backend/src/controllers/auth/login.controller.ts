import type { Context } from "hono";

import { StatusCodes } from "http-status-codes";

import type { LoginDto } from "@/validations/schemas/login.schema.js";

import { setAuthCookies } from "@/controllers/auth/verify-otp.controller.js";
import { generateToken } from "@/lib/jwt.js";
import User from "@/models/user.model.js";
import { responseHandler } from "@/utils/response.js";

export default async (c: Context) => {
  try {
    // Parse and validate request body
    const { email, password, remember } = await c.req.json<LoginDto>();

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return c.json(
        responseHandler(false, `No account found with the email: ${email}. Please check or register.`),
        StatusCodes.UNAUTHORIZED,
      );
    }

    // Check if the email has been verified
    if (!user.emailVerified) {
      return c.json(responseHandler(false, "Your email is not verified. Please try to register yourself again 🤘🏻"), StatusCodes.FORBIDDEN);
    }

    // Verify the entered password
    const passwordMatched = await user.matchPassword(password);
    if (!passwordMatched) {
      return c.json(responseHandler(false, "Incorrect password. Please try again."), StatusCodes.UNAUTHORIZED);
    }

    // Generate authentication tokens (Access & Refresh)
    const [accessToken, refreshToken] = await Promise.all([
      generateToken(user._id as string, "access"),
      generateToken(user._id as string, "refresh"),
    ]);

    // Set authentication cookies for session persistence
    setAuthCookies(c, accessToken, refreshToken, remember);

    // Exclude sensitive data before sending response
    return c.json(responseHandler(true, "Login successful ✅ Welcome back!", user), StatusCodes.OK);
  }
  catch (error) {
    console.error("Login Error:", error);
    return c.json(responseHandler(false, "An unexpected error occurred while processing your login request. Please try again later."), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
