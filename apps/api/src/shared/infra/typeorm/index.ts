import { AppDataSource } from '@infra/db/data-source';

export async function createDatabaseConnecetion() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected!');
  } catch (error) {
    console.error(error);
  }
}