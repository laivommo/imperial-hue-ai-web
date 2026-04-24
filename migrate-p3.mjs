import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);

const sqlFile = fs.readFileSync(
  path.join(process.cwd(), "drizzle/0003_illegal_kronos.sql"),
  "utf-8"
);

// Split by statement-breakpoint
const statements = sqlFile
  .split("--> statement-breakpoint")
  .map((s) => s.trim())
  .filter(Boolean);

for (const stmt of statements) {
  const preview = stmt.substring(0, 60).replace(/\n/g, " ");
  process.stdout.write(`Executing: ${preview}...\n`);
  try {
    await connection.execute(stmt);
    console.log("  Done");
  } catch (err) {
    if (err.code === "ER_TABLE_EXISTS_ERROR" || err.message?.includes("Duplicate column")) {
      console.log("  Skipped (already exists)");
    } else {
      console.error("  Error:", err.message);
    }
  }
}

await connection.end();
console.log("P3 Migration complete!");
