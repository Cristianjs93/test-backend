import { config } from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource } from 'typeorm';

config();

export const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [__dirname + '/../domain/entities/**/*.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/**/*.{js,ts}'],
  synchronize: false,
  ssl: false,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

export const AppDataSource = new DataSource({
  ...pgConfig,
});
