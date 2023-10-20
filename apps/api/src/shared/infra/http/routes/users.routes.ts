import { Router } from 'express';
import { AddPointsToUserController } from 'src/modules/users/useCases/AddPointsToUser/AddPointsToUserController';
import { CreateUserController } from 'src/modules/users/useCases/CreateUser/CreateUserController';
import { ListBetterUsersController } from 'src/modules/users/useCases/ListBetterUsers/ListBetterUsersController';

const userRoutes = Router();

const createUserController = new CreateUserController();
const addPointsToUserController = new AddPointsToUserController();
const listBetterUsersController = new ListBetterUsersController();

userRoutes.post('/', createUserController.handle);
userRoutes.get('/', listBetterUsersController.handle);
userRoutes.put('/add-points', addPointsToUserController.handle);

export { userRoutes };