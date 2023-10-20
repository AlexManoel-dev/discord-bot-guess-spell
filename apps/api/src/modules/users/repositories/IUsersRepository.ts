import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { User } from '../infra/typeorm/entities/User.entity';

interface IUsersRepository {
  create(user: ICreateUserDTO): Promise<User>;
  listBetterUsers(): Promise<User[]>;
  addPointsToUser(discordId: string): Promise<void>;
  findByDiscordId(discordId: string): Promise<User | null>;
}

export { IUsersRepository };
