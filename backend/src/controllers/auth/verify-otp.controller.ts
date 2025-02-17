import type { Context } from "hono";

import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { StatusCodes } from "http-status-codes";

import { envConfig } from "@/config/env.config.js";
import { generateToken, verifyToken } from "@/lib/jwt.js";
import User from "@/models/user.model.js";
import { CookieNames } from "@/resources/cookie.resources.js";
import { responseHandler } from "@/utils/response.js";
import { getExpirationTime } from "@/utils/time.js";

// Sets authentication cookies (Access & Refresh tokens) securely
export async function setAuthCookies(c: Context, accessToken: string, refreshToken: string, remember: boolean = true) {
  const isProd = envConfig.NODE_ENV === "production";

  // Access Token
  setCookie(c, CookieNames.ACCESS_TOKEN, accessToken, {
    httpOnly: true, // Prevents client-side access to the cookie (XSS protection)
    secure: isProd, // Ensures the cookie is only sent over HTTPS in production
    sameSite: "Strict", // Mitigates CSRF attacks
    ...(remember ? { maxAge: getExpirationTime(envConfig.ACCESS_TOKEN_EXP, "s") } : {}),
  });

  // Refresh Token
  setCookie(c, CookieNames.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "Strict",
    ...(remember ? { maxAge: getExpirationTime(envConfig.REFRESH_TOKEN_EXP, "s") } : {}),
  });

  // Auth Config
  setCookie(c, CookieNames.AUTH_CONFIG, JSON.stringify({ remember }), {
    httpOnly: true,
    secure: isProd,
    sameSite: "Strict",
    ...(remember ? { maxAge: getExpirationTime(envConfig.REFRESH_TOKEN_EXP, "s") } : {}),
  });
}

// OTP Verification Handler
export default async (c: Context) => {
  // Extract and validate request parameters
  const field = c.req.param("field");
  const { otp } = await c.req.json();

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
    return c.json(responseHandler(true, "Email verified successfully 👍", user), StatusCodes.CREATED);
  }

  // If the verification field is not recognized
  return c.json(responseHandler(false, "Invalid verification field"), StatusCodes.BAD_REQUEST);
};
