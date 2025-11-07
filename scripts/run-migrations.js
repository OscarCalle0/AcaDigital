import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { pool } from '../src/core/infraestructura/postgres/database/Conexion.ts';

async function run() {
    const migrationsPath = path.resolve(__dirname, '../src/core/infraestructura/postgres/database/migraciones');

    const files = (await fs.readdir(migrationsPath))
        .filter(f => f.endsWith('.sql'))
        .sort();

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY)');

        for (const file of files) {
            const executed = await client.query('SELECT 1 FROM _migrations WHERE name = $1', [file]);
            if (executed.rowCount === 0) {
                console.log('Ejecutando migración:', file);
                const sql = await fs.readFile(path.join(migrationsPath, file), 'utf8');
                await client.query(sql);
                await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
            } else {
                console.log('Ya ejecutada:', file);
            }
        }
        await client.query('COMMIT');
        console.log('TODAS LAS MIGRACIONES COMPLETADAS');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('ERROR EN MIGRACIONES:', e.message);
        process.exit(1);
    } finally {
        client.release();
        process.exit();
    };
};

run();