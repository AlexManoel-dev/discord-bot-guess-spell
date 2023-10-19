import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { User } from '../../infra/typeorm/entities/User.entity';
import { AppError } from 'src/shared/errors/AppError';

interface IRequest {
  name: string;
  discordId: string;
}

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ name, discordId }: IRequest): Promise<User> {
    const userAlreadyExists = await this.usersRepository.findByDiscordId(discordId);
    
    if(userAlreadyExists) {
      throw new AppError('User already exists!');
    }
    
    const user = await this.usersRepository.create({
      name,
      discordId,
      points: 0
    });
    console.log('salve fi');

    return user;
  }
}

export { CreateUserUseCase };
