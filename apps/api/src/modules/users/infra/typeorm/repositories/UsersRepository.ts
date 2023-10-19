import { ICreateUserDTO } from 'src/modules/users/dtos/ICreateUserDTO';
import { IUsersRepository } from 'src/modules/users/repositories/IUsersRepository';
import { User } from '../entities/User.entity';
import { Repository } from 'typeorm';
import { AppDataSource } from '@infra/db/data-source';

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create({ name, discordId, points }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({
      name,
      discordId,
      points
    });

    await this.repository.save(user);

    return user;
  }

  async findByDiscordId(discordId: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { discordId } });

    return user;
  }

  addPointsToUser(discordId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

export { UsersRepository };
