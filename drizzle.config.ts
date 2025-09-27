import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in environment variables");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
