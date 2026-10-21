import { Pool } from "pg";

//El .env ya se cargo en server.ts
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
