import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/user.entity';
import { Category } from './categories/category.entity';
import { Action } from './actions/action.entity';

dotenv.config(); // чтобы подтянуть переменные окружения из .env

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5433,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_DATABASE || 'financial_manager_database',
  entities: [User, Category, Action],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
