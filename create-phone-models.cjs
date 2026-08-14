require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");

(async () => {
  const c = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await c.connect();

  await c.query(`
    CREATE TABLE IF NOT EXISTS phone_models (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      brand varchar(100) NOT NULL,
      name varchar(255) NOT NULL UNIQUE,
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamp NOT NULL DEFAULT now()
    );
  `);

  console.log("PHONE MODELS TABLE CREATED");

  await c.end();
})().catch(e => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
