import Elysia, { status } from "elysia";
import cors from "@elysiajs/cors";
import auth from "~/routers/auth";
import config from "~/config";
import pkg from "../package.json";
import { memoryUsage } from "bun:jsc";
import { swagger } from "@elysiajs/swagger";
import { ElysiaCustomStatusResponse, ValidationError } from "elysia/error";

new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Soundable API",
          version: pkg.version,
          description:
            "A fully self-hosted music library for you and your friends. What you see is the core foundation of Soundable, this is where it all starts.",
        },
      },
    })
  )

  .use(
    cors({
      origin: true, // Allow every origins so everyone can implement their own client for Soundable.
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )

  .onError(({ error, code }) => {
    if (code === "VALIDATION") {
      return {
        ok: false,
        code,
        errors: error.all.map((detail) => detail.summary),
      };
    }
  })

  .get("/", ({ server }) => ({
    ok: true,
    version: pkg.version,
    bun_version: Bun.version_with_sha,
    memory_usage_mb: memoryUsage().current / 8_000_000,
    documentation: new URL("/swagger", server!.url),
  }))

  // Diverse routers for the app.
  .use(auth)

  .listen({ hostname: config.hostname, port: config.port }, (server) => {
    console.log(`[http]: listening on ${server.url} `);
  });
