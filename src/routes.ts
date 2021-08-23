import { Router } from 'express';
import { celebrate } from 'celebrate';

import { MainController } from './core/controllers/MainController';
import { UsersControllers } from './core/controllers/UsersControllers';

import { account } from './core/validators/UsersValidators';
import { SessionsControllers } from './core/controllers/SessionsControllers';

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

/**
 * Path: '/sessions'
 */
const sessionsController = new SessionsControllers();

routes.post('/sessions', sessionsController.signIn);

export { routes };
