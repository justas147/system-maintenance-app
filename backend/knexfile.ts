// Update with your config settings.
import * as dotenv from 'dotenv';
dotenv.config();

const baseConfiguration = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '') || 3306,
  },
  migrations: {
    directory: 'data/migrations',
    tableName: 'KnexMigrations',
  },
  seeds: {
    directory: 'data/seeds',
  },
};

const knexConfig = {
  dev: baseConfiguration,
  production: baseConfiguration,
};

export default knexConfig;