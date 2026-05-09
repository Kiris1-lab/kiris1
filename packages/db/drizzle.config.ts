import type { Config } from "drizzle-kit";

export default {
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://kiris:dev@localhost:5432/kiris",
  },
  strict: true,
  verbose: true,
} satisfies Config;
