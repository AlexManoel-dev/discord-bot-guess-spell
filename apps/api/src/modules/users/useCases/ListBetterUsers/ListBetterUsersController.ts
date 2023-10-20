import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListBetterUsersUseCase } from './ListBetterUsersUseCase';

class ListBetterUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listBetterUsersUseCase = container.resolve(ListBetterUsersUseCase);

    const users = await listBetterUsersUseCase.execute();

    return response.json(users);
  }
}

export { ListBetterUsersController };
