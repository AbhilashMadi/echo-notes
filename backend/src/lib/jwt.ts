import type { JWTPayload } from "jose";

import { jwtVerify, SignJWT } from "jose";

import { envConfig } from "@/config/env.config.js";
import { generateUUID } from "@/utils/generators.js";

// Convert secrets into keys
type TokenType = "access" | "refresh" | "verification";

const secretKeys: Readonly<Record<TokenType, Uint8Array>> = {
  access: new TextEncoder().encode(envConfig.ACCESS_TOKEN_SECRET),
  refresh: new TextEncoder().encode(envConfig.REFRESH_TOKEN_SECRET),
  verification: new TextEncoder().encode(envConfig.VERIFICATION_TOKEN_SECRET),
};

const expTimes: Readonly<Record<TokenType, string>> = {
  access: envConfig.ACCESS_TOKEN_EXP, // 15m
  refresh: envConfig.REFRESH_TOKEN_EXP, // 7d
  verification: envConfig.VERIFIICATION_TOKEN_EXP,
};

// Define Token Payload Interface
interface TokenPayload extends JWTPayload {
  userId: string;
  remember: boolean;
  role?: string;
  jti: string;
}

// **Reusable Function to Generate JWT**
export async function generateToken(userId: string, type: TokenType, role?: string): Promise<string> {
  return await new SignJWT({
    userId,
    role,
    jti: generateUUID(),
    iss: envConfig.BACKEND_DOMAIN,
    aud: envConfig.FRONTEND_DOMAIN,
    iat: Math.floor(Date.now() / 1000),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expTimes[type])
    .sign(secretKeys[type]);
}

// **Reusable Function to Verify JWT**
export async function verifyToken(token: string, type: "access" | "refresh" | "verification"): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKeys[type]);
    return payload as TokenPayload;
  }
  catch (error) {
    console.error(`${type.toUpperCase()} Token verification failed:`, error);
    throw error;
  }
}
