import { buildServer } from "./server.js";

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const server = buildServer();

try {
  await server.listen({ port: PORT, host: HOST });
  console.log(`Server listening on http://${HOST}:${PORT}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
