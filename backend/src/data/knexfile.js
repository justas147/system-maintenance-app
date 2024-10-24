// Update with your config settings.

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const baseConfiguration = {
  client: 'mysql2',
  connection: {
    host : process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "") || 3306,
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    tableName: 'knexMigrations',
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds'),
  },
}

module.exports = {
  development: baseConfiguration,
  production: baseConfiguration,
};
