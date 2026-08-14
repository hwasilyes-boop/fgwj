import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

console.log("DATABASE HOST:", new URL(databaseUrl).hostname);
console.log("DATABASE PORT:", new URL(databaseUrl).port);

const globalForDb = globalThis as typeof globalThis & {
  __wrapyPostgresPool?: Pool;
};

export const pool =
  globalForDb.__wrapyPostgresPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 5,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__wrapyPostgresPool = pool;
}

pool.on("error", (error) => {
  console.error("POSTGRES POOL ERROR:", error);
});

export const db = drizzle(pool);