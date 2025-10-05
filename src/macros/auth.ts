import Elysia from "elysia";
import jwt from "@elysiajs/jwt";
import config from "~/config";
import database from "~/database";
import * as tables from "~/database/schema";
import { eq } from "drizzle-orm";

interface TokenPayload {
  user: string; // => tables.users.id
}

export default new Elysia({ name: "auth" })
  .use(
    jwt({
      name: "jwt",
      secret: config.sessionSecretKey,
    })
  )

  .derive({ as: "scoped" }, ({ jwt }) => ({
    generateToken(id: string) {
      return jwt.sign({
        user: id,
      } satisfies TokenPayload);
    },
  }))

  .macro({
    auth: {
      async resolve({ jwt, status, request: { headers } }) {
        const auth = headers.get("authorization");
        const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

        if (!bearer)
          throw status(403, {
            ok: false,
            code: "PROTECTED_ROUTE",
          });

        const payload = (await jwt.verify(bearer)) as false | TokenPayload;
        if (!payload)
          throw status(401, {
            ok: false,
            code: "TOKEN_INVALID",
          });

        const user = database
          .select()
          .from(tables.users)
          .where(eq(tables.users.id, payload.user))
          .get();

        if (!user)
          throw status(401, {
            ok: false,
            code: "NO_ACCOUNT",
          });

        return {
          user,
        };
      },
    },
  });
