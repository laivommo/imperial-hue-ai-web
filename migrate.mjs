import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const sqlFile = join(__dirname, 'drizzle/0002_brave_microchip.sql');
const sql = readFileSync(sqlFile, 'utf-8');

// Split by --> statement-breakpoint
const statements = sql.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean);

const conn = await createConnection(dbUrl);

for (const stmt of statements) {
  if (!stmt) continue;
  console.log('Executing:', stmt.substring(0, 80) + '...');
  try {
    await conn.execute(stmt);
    console.log('  OK');
  } catch (err) {
    if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_FIELDNAME') {
      console.log('  Skipped (already exists)');
    } else {
      console.error('  Error:', err.message);
    }
  }
}

await conn.end();
console.log('Migration complete!');
