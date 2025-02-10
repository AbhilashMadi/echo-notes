import type { MiddlewareHandler } from "hono";

import { getCookie } from "hono/cookie";

import { verifyToken } from "@/lib/jwt.js";
import { CookieNames } from "@/resources/cookie.resources.js";

const authMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    const token = getCookie(c, CookieNames.ACCESS_TOKEN);

    if (!token) {
      return c.json({ error: "Unauthorized: No token provided" }, 401);
    }

    const payload = await verifyToken(token, "access");

    if (!payload || typeof payload.userId !== "string") {
      return c.json({ error: "Unauthorized: Invalid token" }, 401);
    }

    // Correct way to set context variable
    c.set("user", { userId: payload.userId });

    await next();
  }
  catch (error) {
    console.error("Authentication error:", error);
    return c.json({ error: "Unauthorized: Invalid or expired token" }, 401);
  }
};

export default authMiddleware;
