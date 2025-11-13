import fs from 'fs';
import path from 'path';
import { projectRoot } from '../src/config/env.js';
import { pool, closePool } from '../src/config/database.js';

const seedersDir = path.join(projectRoot, 'seeders');

async function run() {
  const files = fs
    .readdirSync(seedersDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (!files.length) {
    console.log('No seed files found.');
    return;
  }

  for (const file of files) {
    const filePath = path.join(seedersDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    if (!sql.trim()) {
      console.log(`Skipping empty seed: ${file}`);
      continue;
    }
    console.log(`Running seed: ${file}`);
    await pool.query(sql);
  }
  console.log('Seeders completed.');
}

run()
  .catch((err) => {
    console.error('Seeder failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool().catch(() => {});
  });
