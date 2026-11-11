import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Match Next.js: .env.local wins over .env (dotenv never overrides a set var).
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
