import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { StatusCodes } from "http-status-codes";

import { generateToken, verifyToken } from "@/lib/jwt.js";
import { CookieNames } from "@/resources/cookie.resources.js";
import { responseHandler } from "@/utils/response.js";
import { setAuthCookies } from "@/controllers/auth/verify-otp.controller.js";

export default async (c: Context) => {
  try {
    // Get refresh token from cookie
    const refreshToken = getCookie(c, CookieNames.REFRESH_TOKEN);
    const { remember = false } = JSON.parse(getCookie(c, CookieNames.AUT_CONFIG) || "");

    if (!refreshToken) {
      return c.json(responseHandler(false, "Refresh token missing"), StatusCodes.UNAUTHORIZED);
    }

    // Verify refresh token
    const decoded = await verifyToken(refreshToken, "refresh");
    if (!decoded || !decoded.userId) {
      return c.json(responseHandler(false, "Invalid or expired refresh token"), StatusCodes.UNAUTHORIZED);
    }

    // Generate new tokens
    const [newAccessToken, newRefreshToken] = await Promise.all([
      generateToken(decoded.userId as string, "access"),
      generateToken(decoded.userId as string, "refresh"),
    ]);

    // Set new refresh token in cookie
    setAuthCookies(c, newAccessToken, newRefreshToken, remember);

    // Return new access token
    return c.json(
      responseHandler(true, "Token refreshed successfully"),
      StatusCodes.OK
    );
  } catch (error) {
    console.warn("Refresh token error: ", error);
    throw error;
  }
};
