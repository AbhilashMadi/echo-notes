import type { Context } from "hono";

import { setCookie } from "hono/cookie";
import { StatusCodes } from "http-status-codes";

import type { SignupSchema } from "@/validations/schemas/signup.schema.js";

import { sendEmail } from "@/config/email-client.config.js";
import { envConfig } from "@/config/env.config.js";
import { generateToken } from "@/lib/jwt.js";
import User from "@/models/user.model.js";
import { CookieNames } from "@/resources/cookie.resources.js";
import verifyOtpTemplate from "@/templates/verify-otp.template.js";
import { generateOTP } from "@/utils/generators.js";
import { responseHandler } from "@/utils/response.js";
import { getExpirationTime } from "@/utils/time.js";

export default async (c: Context) => {
  try {
    // Parse and validate request body
    const { email, password } = await c.req.json<SignupSchema>();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.emailVerified) {
      return c.json(
        responseHandler(false, "Email already verified, please login.", null),
        StatusCodes.CONFLICT,
      );
    }

    // Generate OTP & expiration time
    const verificationOtp = generateOTP();

    let savedUser;
    if (existingUser) {
      // Update existing user's OTP and reset password
      existingUser.emailVerificationOtp = verificationOtp;
      existingUser.password = password;
      savedUser = await existingUser.save();
    }
    else {
      // Create new user
      const newUser = new User({ email, password, verificationOtp });
      savedUser = await newUser.save();
    }

    // Generate JWT token for OTP verification & set it in a secure cookie
    const verificationToken = await generateToken(savedUser._id as string, "verification");

    setCookie(c, CookieNames.VERIFY_EMAIL_OTP, verificationToken, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: getExpirationTime(envConfig.VERIFIICATION_TOKEN_EXP, "s"),
    });

    // Send OTP to user's email
    // If the email is not deliveried throughs an errors
    await sendEmail("abhilashkumar1563@gmail.com", "Welcome to Our Platform 🎉", verifyOtpTemplate(verificationOtp));

    // Inform client the otp is sent
    return c.json(
      responseHandler(true, "OTP sent successfully. Please verify your email.", null),
      StatusCodes.OK,
    );
  }
  catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};
