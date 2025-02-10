import type { MiddlewareHandler } from "hono";

import { getCookie } from "hono/cookie";

import { verifyToken } from "@/lib/jwt.js";
import { CookieNames } from "@/resources/cookie.resources.js";
import { responseHandler } from "@/utils/response.js";
import { StatusCodes } from "http-status-codes";

const authMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    const token = getCookie(c, CookieNames.ACCESS_TOKEN);

    if (!token) {
      return c.json(responseHandler(false, "Unauthorized: No token provided"), StatusCodes.UNAUTHORIZED);
    }

    const payload = await verifyToken(token, "access");

    if (!payload || typeof payload.userId !== "string") {
      return c.json(responseHandler(false, "Unauthorized: Invalid token"), StatusCodes.UNAUTHORIZED);
    }

    // Correct way to set context variable
    c.set("user", { userId: payload.userId });

    await next();
  }
  catch (error) {
    console.error("Authentication error:", error);
    return c.json(responseHandler(false, "Unauthorized: Invalid or expired token"), StatusCodes.UNAUTHORIZED);
  }
};

export default authMiddleware;
