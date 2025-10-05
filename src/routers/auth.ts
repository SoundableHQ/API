import Elysia, { t } from "elysia";
import auth from "~/macros/auth";
import config from "~/config";
import database from "~/database";
import * as tables from "~/database/schema";
import { eq } from "drizzle-orm";

export default new Elysia({ prefix: "auth" })
  .use(auth)
  .get("/", ({ user: { password, ...user } }) => ({ ok: true, user }), {
    auth: true,
  })
  .post(
    "/sign-up",
    async ({ body, status, generateToken }) => {
      if (!config.allowSignUp)
        throw status(400, {
          ok: false,
          code: "SIGN_UP_DISALLOWED",
        });

      const username = body.username;

      {
        const user = database
          .select()
          .from(tables.users)
          .where(eq(tables.users.username, username))
          .get();

        if (user)
          throw status(400, {
            ok: false,
            code: "USERNAME_ALREADY_TAKEN",
          });
      }

      const password = await Bun.password.hash(body.password);

      try {
        const user = database
          .insert(tables.users)
          .values({
            username,
            password,
          })
          .returning()
          .get();

        const token = await generateToken(user.id);

        return {
          ok: true,
          token,
        };
      } catch {
        throw status(500, {
          ok: false,
          code: "ERROR_DATABASE",
        });
      }
    },
    {
      body: t.Object({
        username: t.String({ minLength: 3, maxLength: 30 }),
        password: t.String({ minLength: 8, maxLength: 50 }),
      }),
    }
  )
  .post(
    "/sign-in",
    async ({ body, status, generateToken }) => {
      const user = database
        .select()
        .from(tables.users)
        .where(eq(tables.users.username, body.username))
        .get();

      if (!user)
        throw status(400, {
          ok: false,
          code: "NO_ACCOUNT",
        });

      if (!(await Bun.password.verify(body.password, user.password)))
        throw status(403, {
          ok: false,
          code: "PASSWORD_INVALID",
        });

      const token = await generateToken(user.id);

      return {
        ok: true,
        token,
      };
    },
    {
      body: t.Object({
        username: t.String({ minLength: 3, maxLength: 30 }),
        password: t.String({ minLength: 8, maxLength: 50 }),
      }),
    }
  );
