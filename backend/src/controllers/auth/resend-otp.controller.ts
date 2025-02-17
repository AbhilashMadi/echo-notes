import type { Context } from "hono";

import { getCookie, setCookie } from "hono/cookie";
import { StatusCodes } from "http-status-codes";

import { sendEmail } from "@/config/email-client.config.js";
import { envConfig } from "@/config/env.config.js";
import { generateToken, verifyToken } from "@/lib/jwt.js";
import User from "@/models/user.model.js";
import { CookieNames } from "@/resources/cookie.resources.js";
import verifyOtpTemplate from "@/templates/verify-otp.template.js";
import { generateOTP } from "@/utils/generators.js";
import { responseHandler } from "@/utils/response.js";
import { getExpirationTime } from "@/utils/time.js";

export default async (c: Context) => {
  // Retrieve OTP verification token from cookies
  const otpCookie = getCookie(c, CookieNames.VERIFY_EMAIL_OTP);
  if (!otpCookie) {
    return c.json(
      responseHandler(false, "OTP request expired, please initiate verification again"),
      StatusCodes.BAD_REQUEST,
    );
  }

  // Decode OTP token
  const decodedToken = await verifyToken(otpCookie, "verification");
  if (!decodedToken?.userId) {
    return c.json(responseHandler(false, "Invalid request"), StatusCodes.BAD_REQUEST);
  }

  // Fetch user from DB
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    return c.json(responseHandler(false, "User not found"), StatusCodes.NOT_FOUND);
  }

  // Generate new OTP
  const newOtp = generateOTP();
  user.emailVerificationOtp = newOtp;
  await user.save();

  // Send OTP via email
  await sendEmail(user.email, "Your OTP Code", verifyOtpTemplate(newOtp));

  // Store new OTP token in cookies
  const otpToken = await generateToken(decodedToken.userId, "verification");
  setCookie(c, CookieNames.VERIFY_EMAIL_OTP, otpToken, {
    httpOnly: true,
    secure: envConfig.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: getExpirationTime(envConfig.VERIFIICATION_TOKEN_EXP, "s"),
  });

  return c.json(responseHandler(true, "OTP resent successfully. Check your email."), StatusCodes.OK);
};
