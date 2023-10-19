import { UsersRepository } from 'src/modules/users/infra/typeorm/repositories/UsersRepository';
import { IUsersRepository } from 'src/modules/users/repositories/IUsersRepository';
import { container } from 'tsyringe';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);