import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { User } from '../../infra/typeorm/entities/User.entity';

@injectable()
class ListBetterUsersUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute(): Promise<User[]> {
    const users = await this.usersRepository.listBetterUsers();

    return users;
  }
}

export { ListBetterUsersUseCase };
