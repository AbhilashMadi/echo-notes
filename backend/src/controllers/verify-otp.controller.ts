import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import { envConfig } from "@/config/env.config.js";
import { generateToken, verifyToken } from "@/lib/jwt.js";

import User from "@/models/user.model.js";

import { CookieNames } from "@/resources/cookie.resources.js";
import { responseHandler } from "@/utils/response.js";
import { verifyFieldSchema, verifyOtpSchema } from "@/validations/schemas/verify-otp.schema.js";
import { getExpirationTime } from "@/utils/time.js";

// Sets authentication cookies (Access & Refresh tokens) securely
const setAuthCookies = (c: Context, accessToken: string, refreshToken: string) => {
  setCookie(c, CookieNames.ACCESS_TOKEN, accessToken, {
    httpOnly: true, // Prevents client-side access to the cookie (XSS protection)
    secure: envConfig.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS in production
    sameSite: "Strict", // Mitigates CSRF attacks
    maxAge: getExpirationTime(envConfig.ACCESS_TOKEN_EXP, "s"), // Cookie expiration time
  });

  setCookie(c, CookieNames.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: envConfig.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: getExpirationTime(envConfig.REFRESH_TOKEN_EXP, "s"),
  });
};

// Handles errors in a standardized way.
const handleErrors = (c: Context, error: any) => {
  if (error instanceof ZodError) {
    return c.json(responseHandler(false, "Validation Error", null, {
      messages: error.issues.map((i) => i.message),
    }), StatusCodes.BAD_REQUEST);
  }

  console.error("Error in OTP verification:", error);
  throw error;
};

// OTP Verification Handler
export default async (c: Context) => {
  try {
    // Extract and validate request parameters
    const { field } = verifyFieldSchema.parse({ field: c.req.param("field") });
    const { otp } = verifyOtpSchema.parse(await c.req.json());

    // Retrieve the OTP verification token from cookies
    const otpCookie = getCookie(c, CookieNames.VERIFY_EMAIL_OTP);
    if (!otpCookie) {
      return c.json(responseHandler(false, "Invalid request"), StatusCodes.BAD_REQUEST);
    }

    // Verify the OTP token and extract user ID
    const decodedToken = await verifyToken(otpCookie, "verification");
    if (!decodedToken?.userId) {
      return c.json(responseHandler(false, "Invalid or expired OTP token"), StatusCodes.BAD_REQUEST);
    }

    // Fetch the user from the database
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return c.json(responseHandler(false, "User not found"), StatusCodes.BAD_REQUEST);
    }

    // Validate the provided OTP
    if (user.emailVerificationOtp !== otp) {
      return c.json(responseHandler(false, "Invalid OTP"), StatusCodes.UNAUTHORIZED);
    }

    // Handle OTP verification for different fields (Currently supporting email)
    if (field === "email") {
      // Generate authentication tokens
      const [accessToken, refreshToken] = await Promise.all([
        generateToken(user._id as string, "access"),
        generateToken(user._id as string, "refresh"),
      ]);

      // Set authentication cookies
      setAuthCookies(c, accessToken, refreshToken);
      deleteCookie(c, CookieNames.VERIFY_EMAIL_OTP);

      // Mark email as verified and clear OTP
      user.emailVerificationOtp = "";
      user.emailVerified = true;
      await user.save();

      // Exclude values from user document
      return c.json(responseHandler(true, "Email verified successfully 👍", user), StatusCodes.OK);
    }

    // If the verification field is not recognized
    return c.json(responseHandler(false, "Invalid verification field"), StatusCodes.BAD_REQUEST);
  } catch (error) {
    return handleErrors(c, error);
  }
};
