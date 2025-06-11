import Elysia from "elysia";

export default new Elysia({ name: "auth" }).macro({
  auth: {
    async resolve({ status, request: { headers } }) {
      const auth = headers.get("authorization");
      const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

      if (!bearer)
        return status(401, {
          message:
            "You're trying to access a protected route, you must pass in your bearer token.",
        });

      return {
        session: {},
      };
    },
  },
});
