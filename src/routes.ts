import { Router } from 'express';
import { celebrate } from 'celebrate';

import { MainController } from './core/controllers/MainController';
import { UsersControllers } from './core/controllers/UsersControllers';

import { account } from './core/validators/UsersValidators';

const { signUpSchema } = account.body;

const routes = Router();

/**
 * Path: '/'
 */
const mainController = new MainController();

routes.get('/', mainController.main);

/**
 * Path: '/users'
 */
const usersControllers = new UsersControllers();

routes.get('/users', usersControllers.all);
routes.get('/users/:id', usersControllers.findId);

routes.post(
  '/users',
  celebrate({ body: signUpSchema }),
  usersControllers.create
);

export { routes };
