import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import config from "~/config";
import path from "node:path";

const sqlite = new Database(config.databasePath);
const database = drizzle({ client: sqlite, casing: "snake_case" });

migrate(database, {
  migrationsFolder: path.join(__dirname, "../..", "drizzle"),
});

export default database;
