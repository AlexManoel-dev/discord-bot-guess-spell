import { Router } from 'express';
import { CreateUserController } from 'src/modules/users/useCases/CreateUser/CreateUserController';

const userRoutes = Router();

const createUserController = new CreateUserController();

userRoutes.post('/', createUserController.handle);
userRoutes.get('/', (req, res) => {
  res.send({ message: 'Get route' });
});

export { userRoutes };