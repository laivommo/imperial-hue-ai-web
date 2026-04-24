import { createConnection } from "mysql2/promise";
import { readFileSync } from "fs";
import { createHash } from "crypto";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL not set");

const conn = await createConnection(DATABASE_URL);

// Apply migration
const sql = readFileSync("./drizzle/0004_funny_raza.sql", "utf8");
const statements = sql.split(";").map(s => s.trim()).filter(Boolean);
for (const stmt of statements) {
  await conn.execute(stmt);
  console.log("Executed:", stmt.slice(0, 60) + "...");
}

// Seed default admin password: Abc@123456
const DEFAULT_PASSWORD = "Abc@123456";
const hash = createHash("sha256").update(DEFAULT_PASSWORD).digest("hex");
await conn.execute(
  `INSERT INTO siteSettings (\`key\`, value) VALUES ('admin_password_hash', ?) 
   ON DUPLICATE KEY UPDATE value = VALUES(value)`,
  [hash]
);
console.log("Admin password hash seeded (Abc@123456)");

await conn.end();
console.log("Migration P4 complete!");
