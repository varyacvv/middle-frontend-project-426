import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function buildServer() {
  const server = Fastify({ logger: true });

  server.get("/api/health", async () => {
    return { status: "ok" };
  });

  // Удалить после проверки
  server.get("/api/debug-sentry", async () => {
    throw new Error("Test error from backend");
  });

  server.register(fastifyStatic, {
    root: resolve(__dirname, "../../frontend/dist"),
    prefix: "/",
  });

  server.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith("/api/")) {
      reply.code(404).send({ error: "Not Found" });
      return;
    }
    return reply.sendFile("index.html");
  });

  return server;
}
