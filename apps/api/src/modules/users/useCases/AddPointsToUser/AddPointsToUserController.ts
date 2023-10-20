import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AddPointsToUserUseCase } from './AddPointsToUserUseCase';

class AddPointsToUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { discordId } = request.body;

    const addPointsToUserUseCase = container.resolve(AddPointsToUserUseCase);

    await addPointsToUserUseCase.execute(discordId);

    return response.send();
  }
}

export { AddPointsToUserController };
