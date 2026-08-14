require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");

(async () => {
  const c = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await c.connect();

  const r = await c.query(`
    SELECT id, brand, name, is_active
    FROM phone_models
    ORDER BY brand, name
  `);

  console.table(r.rows);

  await c.end();
})().catch(e => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
