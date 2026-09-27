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
