import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  // Use FRONTEND_URL as baseURL so OAuth callbacks go through the frontend proxy
  // This keeps all cookies on the frontend domain (first-party)
  baseURL: process.env.FRONTEND_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.BACKEND_URL || "http://localhost:3001",
  ],
  advanced: {
    // Disable __Secure- prefix which can cause issues with state cookies
    useSecureCookies: false,
    defaultCookieAttributes: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "tutor",
      },
    },
  },
});
