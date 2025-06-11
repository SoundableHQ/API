import Elysia from "elysia";
import cors from "@elysiajs/cors";
import auth from "~/routers/auth";
import config from "~/config";
import pkg from "../package.json";
import { memoryUsage } from "bun:jsc";

new Elysia()
  .use(
    cors({
      origin: true, // Allow every origins so everyone can implement their own client for Soundable.
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )

  .get("/", () => ({
    version: pkg.version,
    bunVersion: Bun.version,
    bunRevision: Bun.revision,
    memory: memoryUsage(),
  }))

  // Diverse routers for the app.
  .use(auth)

  .listen({ hostname: config.hostname, port: config.port }, (server) => {
    console.log(`[HTTP]: listening on ${server.url} `);
  });
