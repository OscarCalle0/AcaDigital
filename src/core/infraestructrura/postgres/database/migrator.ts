import { Pool, Client } from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface MigrationFile {
  name: string;
  path: string;
}

async function createDatabaseIfNotExists(): Promise<void> {
  const dbName = process.env.DB_NAME || 'acadigital';
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '5432');
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';

  // Conectar a la base de datos 'postgres' para crear la nueva base de datos
  const adminClient = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres', // Conectarse a la base de datos por defecto
  });

  try {
    await adminClient.connect();
    
    // Verificar si la base de datos existe
    const result = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rows.length === 0) {
      // Crear la base de datos si no existe
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Base de datos "${dbName}" creada exitosamente`);
    } else {
      console.log(`✅ Base de datos "${dbName}" ya existe`);
    }
  } catch (error: any) {
    console.error(`❌ Error al crear la base de datos:`, error.message);
    throw error;
  } finally {
    await adminClient.end();
  }
}

async function getMigrationFiles(): Promise<MigrationFile[]> {
  const migrationsPath = join(__dirname, 'migraciones', 'migrations');
  const { readdirSync } = await import('fs');
  
  const files = readdirSync(migrationsPath)
    .filter(file => file.endsWith('.sql'))
    .sort()
    .map(file => ({
      name: file,
      path: join(migrationsPath, file)
    }));

  return files;
}

async function runMigrations(): Promise<void> {
  const dbName = process.env.DB_NAME || 'acadigital';
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '5432');
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';

  // Primero crear la base de datos si no existe
  await createDatabaseIfNotExists();

  // Conectar a la base de datos creada
  const pool = new Pool({
    host,
    port,
    database: dbName,
    user,
    password,
  });

  try {
    // Crear tabla de control de migraciones si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Obtener migraciones ejecutadas
    const executedMigrations = await pool.query(
      'SELECT version FROM schema_migrations ORDER BY version'
    );
    const executedVersions = new Set(
      executedMigrations.rows.map((row: any) => row.version)
    );

    // Obtener archivos de migración
    const migrationFiles = await getMigrationFiles();

    // Ejecutar migraciones pendientes
    for (const migration of migrationFiles) {
      const version = migration.name.replace('.sql', '');
      
      if (executedVersions.has(version)) {
        console.log(`⏭️  Migración ${migration.name} ya ejecutada, omitiendo...`);
        continue;
      }

      console.log(`🔄 Ejecutando migración: ${migration.name}...`);
      
      const sql = readFileSync(migration.path, 'utf-8');
      
      // Ejecutar la migración en una transacción
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (version) VALUES ($1)',
          [version]
        );
        await client.query('COMMIT');
        console.log(`✅ Migración ${migration.name} ejecutada exitosamente`);
      } catch (error: any) {
        await client.query('ROLLBACK');
        console.error(`❌ Error en migración ${migration.name}:`, error.message);
        throw error;
      } finally {
        client.release();
      }
    }

    console.log('✅ Todas las migraciones se ejecutaron correctamente');
  } catch (error: any) {
    console.error('❌ Error ejecutando migraciones:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

export { runMigrations, createDatabaseIfNotExists };
