import { buildServer } from "./server.js";
import { pool } from "./db.js";
import { runMigrations } from "./migrate.js";
import { seedCatalog } from "./seed.js";

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connection OK");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }

  try {
    await runMigrations();
    await seedCatalog();
  } catch (err) {
    console.error("Migrations/seed failed:", err);
    process.exit(1);
  }

  const server = buildServer();
  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`Server listening on http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
