import type { Context } from "hono";

import { deleteCookie } from "hono/cookie";
import { StatusCodes } from "http-status-codes";

import { CookieNames } from "@/resources/cookie.resources.js";
import { responseHandler } from "@/utils/response.js";

export default async (c: Context) => {
  try {
    // Delete authentication cookies
    deleteCookie(c, CookieNames.ACCESS_TOKEN);
    deleteCookie(c, CookieNames.REFRESH_TOKEN);
    deleteCookie(c, CookieNames.AUTH_CONFIG);

    return c.json(responseHandler(true, "Logout successful."), StatusCodes.OK);
  }
  catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};
