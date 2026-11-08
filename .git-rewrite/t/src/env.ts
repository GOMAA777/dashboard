import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_BASE_URL: z.string().url().optional().default("http://localhost:8000/api"),
  API_SECRET_KEY: z.string().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
});

const serverParsed = serverEnvSchema.safeParse(process.env);
const clientParsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!serverParsed.success) {
  console.error("❌ Invalid server environment variables:", serverParsed.error.flatten().fieldErrors);
  throw new Error("Invalid server environment variables");
}

if (!clientParsed.success) {
  console.error("❌ Invalid client environment variables:", clientParsed.error.flatten().fieldErrors);
  throw new Error("Invalid client environment variables");
}

export const env = {
  ...serverParsed.data,
  ...clientParsed.data,
};
