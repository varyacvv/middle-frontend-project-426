import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "@fastify/cookie";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { authRoutes } from "./auth/routes.js";
import { catalogRoutes } from "./catalog/routes.js";
import { promosRoutes } from "./promos/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function buildServer() {
  const server = Fastify({ logger: true });

  server.register(fastifyCookie);

  server.get("/api/health", async () => {
    return { status: "ok" };
  });

  server.register(authRoutes);
  server.register(catalogRoutes);
  server.register(promosRoutes);

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
