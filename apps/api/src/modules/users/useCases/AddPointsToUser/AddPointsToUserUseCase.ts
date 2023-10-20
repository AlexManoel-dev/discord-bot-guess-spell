import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { AppError } from 'src/shared/errors/AppError';

@injectable()
class AddPointsToUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute(discordId: string): Promise<void> {
    await this.usersRepository.addPointsToUser(discordId);
  }
}

export { AddPointsToUserUseCase };
