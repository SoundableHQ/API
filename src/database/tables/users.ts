import { sql } from "drizzle-orm";
import {
  text,
  sqliteTable as table,
  uniqueIndex,
  integer,
} from "drizzle-orm/sqlite-core";

export const users = table(
  "users",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => Bun.randomUUIDv7("base64url")),

    /**
     * Username of the user, will be used to authenticate.
     *
     * - Should be more than 3 characters long but less than 30 characters long.
     * - Should only contain alphanumeric characters, underscores, and dots.
     */
    username: text({ length: 30 }).notNull(),

    /**
     * Users can customize their display name so it brings more style
     * instead of a simple username with no meaning.
     *
     * - Should be less than 200 characters.
     */
    display_name: text({ length: 200 }),

    /**
     * Hashed password, hashed using Bun's
     * [argon2id](https://en.wikipedia.org/wiki/Argon2) implementation.
     */
    password: text().notNull(),

    /**
     * Timestamp when the user was created.
     */
    created_at: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),

    /**
     * Timestamp of the last time the user got updated,
     * `username`, `display_name` or `password` change.
     */
    updated_at: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => sql`(unixepoch())`),
  },
  (table) => [uniqueIndex("username_idx").on(table.username)]
);
