import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./db";
(async function main() {
  console.log("Running migrations");
  await migrate(db, { migrationsFolder: "db/migrations" });
  console.log("Migrated successfully");
})();
