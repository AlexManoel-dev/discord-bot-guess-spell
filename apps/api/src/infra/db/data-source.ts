import { join } from 'path';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "database",
  port: 5432,
  username: "admin",
  password: "123mudar",
  database: "database",
  synchronize: true,
  logging: true,
  entities: [
    join(__dirname, '../../modules/**/infra/typeorm/entities/*.entity.ts')
  ],
  subscribers: [],
  migrations: [
    'src/shared/infra/typeorm/migrations/*.ts',
  ],
});