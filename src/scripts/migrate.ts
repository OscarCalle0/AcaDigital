import 'dotenv/config';
import { runMigrations } from '../core/infraestructrura/postgres/database/migrator.js';

async function main() {
  try {
    console.log('🚀 Iniciando migraciones...\n');
    await runMigrations();
    console.log('\n✨ Proceso completado exitosamente');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Error durante las migraciones:', error.message);
    process.exit(1);
  }
}

main();

