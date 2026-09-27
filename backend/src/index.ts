import * as Sentry from "@sentry/node";
import { buildServer } from "./server.js";
import { pool } from "./db.js";
import { runMigrations } from "./migrate.js";
import { seedCatalog } from "./seed.js";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV ?? "development",
});

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connection OK");
  } catch (err) {
    console.error("Database connection failed:", err);
    Sentry.captureException(err);
    process.exit(1);
  }

  try {
    await runMigrations();
    await seedCatalog();
  } catch (err) {
    console.error("Migrations/seed failed:", err);
    Sentry.captureException(err);
    process.exit(1);
  }

  const server = buildServer();

  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`Server listening on http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    Sentry.captureException(err);
    process.exit(1);
  }
}

start();
