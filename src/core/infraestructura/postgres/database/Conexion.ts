import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  console.error('ERROR: No se encontro DATABASE_URL, Asegurate de que tu archivo .env este en la raiz');

  process.exit(1);
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});