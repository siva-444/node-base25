import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function runMigration(file) {
  const filePath = path.resolve("db/migrations", file);
  const sql = fs.readFileSync(filePath, "utf8");

  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true, // allow multiple queries
  });

  console.log(`\n🚀 Running migration: ${file}`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.query(`USE \`${DB_NAME}\`;`);
  await connection.query(sql);

  await connection.end();
  console.log(`✅ Completed: ${file}`);
}

const commands = {
  init: ["001_init.sql"],
  seed: ["002_seed.sql"],
  cleanup: ["003_cleanup.sql"],
  all: ["001_init.sql", "002_seed.sql"],
  reset: ["003_cleanup.sql", "002_seed.sql"],
};

async function main() {
  const arg = process.argv[2]; // e.g., "init"
  if (!commands[arg]) {
    console.error("❌ Unknown command. Use one of:", Object.keys(commands));
    process.exit(1);
  }

  for (const file of commands[arg]) {
    await runMigration(file);
  }
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
