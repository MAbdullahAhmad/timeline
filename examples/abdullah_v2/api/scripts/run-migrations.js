import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { projectRoot } from '../src/config/env.js';
import { pool, closePool } from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(projectRoot, 'migrations');

async function run() {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    if (!sql.trim()) continue;
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
  }
  console.log('Migrations completed.');
}

run()
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool().catch(() => {});
  });
