import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 10,
  namedPlaceholders: true,
});

export const checkDBConnection = async () => {
  let connection;
  try {
    // Attempt to get a connection from the pool
    connection = await pool.getConnection();

    // Use ping() to confirm the server is responsive
    await connection.ping();

    console.info(
      "\x1b[43m",
      "MYSQL",
      "\x1b[0m",
      "Database connection is healthy.",
    );
  } catch (error) {
    console.error(
      "\x1b[30m",
      "MYSQL",
      "\x1b[0m",
      "Failed to establish database connection:",
      error,
    );
  } finally {
    // Release the connection back to the pool if it was acquired
    if (connection) {
      connection.release();
    }
  }
};

export default pool;
