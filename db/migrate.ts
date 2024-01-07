import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./db";
(async function main() {
  await migrate(db, { migrationsFolder: "db/migrations" });
})();
