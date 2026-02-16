const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const connectionString = "postgres://af918c21b2e14907cf59e272a8cc95169ed3ae803ab4116d2548b74d2fd58a41:sk_adg7A3GAJTTatsrAjsK6I@db.prisma.io:5432/postgres?sslmode=require";
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('Successfully connected to PostgreSQL');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from DB:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error', err.stack);
  }
}

testConnection();
