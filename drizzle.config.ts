import type { Config } from "drizzle-kit";
import { server_env } from "./env";

export default {
  schema: "db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: server_env.DATABASE_URL,
    authToken: server_env.DATABASE_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
  out: "db/migrations",
} satisfies Config;
