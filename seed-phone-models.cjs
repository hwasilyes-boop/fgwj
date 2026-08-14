require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");

const models = [
  ["Apple", "iPhone 16 Pro Max"],
  ["Apple", "iPhone 16 Pro"],
  ["Apple", "iPhone 16 Plus"],
  ["Apple", "iPhone 16"],
  ["Apple", "iPhone 15 Pro Max"],
  ["Apple", "iPhone 15 Pro"],
  ["Apple", "iPhone 15 Plus"],
  ["Apple", "iPhone 15"],
  ["Apple", "iPhone 14 Pro Max"],
  ["Apple", "iPhone 14 Pro"],
  ["Apple", "iPhone 14 Plus"],
  ["Apple", "iPhone 14"],
  ["Apple", "iPhone 13 Pro Max"],
  ["Apple", "iPhone 13 Pro"],
  ["Apple", "iPhone 13"],
  ["Apple", "iPhone 13 Mini"],
  ["Samsung", "Galaxy S25 Ultra"],
  ["Samsung", "Galaxy S25+"],
  ["Samsung", "Galaxy S25"],
  ["Samsung", "Galaxy S24 Ultra"],
  ["Samsung", "Galaxy S24+"],
  ["Samsung", "Galaxy S24"]
];

(async () => {
  const c = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await c.connect();

  for (const [brand, name] of models) {
    await c.query(
      `
      INSERT INTO phone_models (brand, name, is_active)
      VALUES ($1, $2, true)
      ON CONFLICT (name) DO NOTHING
      `,
      [brand, name]
    );
  }

  console.log(`INSERTED ${models.length} PHONE MODELS`);

  await c.end();
})().catch(e => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
