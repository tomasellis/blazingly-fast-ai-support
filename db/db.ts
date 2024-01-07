import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { server_env } from "@/env";
import * as schema from "./schema";

export const client = createClient({
  url: server_env.DATABASE_URL,
  authToken: server_env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
