import type { SignupSchema } from "@/validations/schemas/signup.schema.js";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";

import { envConfig } from "@/config/env.config.js";
import User from "@/models/user.model.js";
import { generateOTP } from "@/utils/generators.js";
import { responseHandler } from "@/utils/response.js";
import { StatusCodes } from "http-status-codes";
import { CookieNames } from "@/resources/cookie.resources.js";
import { generateToken } from "@/lib/jwt.js";
import { getExpirationTime } from "@/utils/time.js";

async function sendOTP(email: SignupSchema["email"], otp: string) {
  console.info("Sending OTP:", { email, otp });
  // Implement actual OTP sending via email service here
}

export default async (c: Context) => {
  try {
    // Parse and validate request body
    const { email, password } = await c.req.json<SignupSchema>();

    // Check if user already exists
    let existingUser = await User.findOne({ email });

    if (existingUser && existingUser.emailVerified) {
      return c.json(
        responseHandler(false, "Email already verified, please login.", null),
        StatusCodes.BAD_REQUEST
      );
    }

    // Generate OTP & expiration time
    const emailVerificationOtp = generateOTP();

    let savedUser;
    if (existingUser) {
      // Update existing user's OTP and reset password
      existingUser.emailVerificationOtp = emailVerificationOtp;
      existingUser.password = password;
      savedUser = await existingUser.save();
    } else {
      // Create new user
      const newUser = new User({ email, password, emailVerificationOtp });
      savedUser = await newUser.save();
    }

    // Generate JWT token for OTP verification & set it in a secure cookie
    const verificationToken = await generateToken(savedUser._id as string, "verification");

    setCookie(c, CookieNames.VERIFY_EMAIL_OTP, verificationToken, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: getExpirationTime(envConfig.VERIFICATION_TOKEN_EXP),
    });

    // Send OTP to user's email
    await sendOTP(email, emailVerificationOtp);

    return c.json(
      responseHandler(true, "OTP sent successfully. Please verify your email.", null),
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return c.json(responseHandler(false, "Internal Server Error", null), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
