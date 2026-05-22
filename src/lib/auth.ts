import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const betterAuthSecret = process.env.BETTER_AUTH_SECRET;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for Better Auth.");
}

if (!betterAuthSecret) {
  throw new Error("BETTER_AUTH_SECRET is required for Better Auth.");
}

const betterAuthUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  database: new Pool({
    connectionString: databaseUrl,
    ssl:
      databaseUrl.includes("neon.tech") || databaseUrl.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : undefined
  }),
  secret: betterAuthSecret,
  baseURL: betterAuthUrl,
  trustedOrigins: [betterAuthUrl],
  emailAndPassword: {
    enabled: true
  },
  plugins: [nextCookies()]
});
