import Fastify from "fastify";

export function buildServer() {
  const server = Fastify({ logger: true });

  server.get("/api/health", async () => {
    return { status: "ok" };
  });

  return server;
}
