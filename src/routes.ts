import { Router } from 'express';
import { celebrate } from 'celebrate';

import { jwtConfig } from './config/jsonwebtoken';

import { MainController } from './core/controllers/MainController';
import { UsersControllers } from './core/controllers/UsersControllers';

import { account } from './core/validators/UsersValidators';
import { SessionsControllers } from './core/controllers/SessionsControllers';

import { authenticate } from './core/middlewares/ensureAuthentication';

const authentication = authenticate({
  secret: jwtConfig.secret,
  avaliableHeaders: ['authorization'],
});

const { signUpSchema, signInSchema } = account.body;

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

routes.get('/users', authentication, usersControllers.all);
routes.get('/users/:id', authentication, usersControllers.findId);

routes.get('/me', authentication, usersControllers.me);

routes.post(
  '/users',
  celebrate({ body: signUpSchema }),
  usersControllers.create
);

routes.delete('/users', authentication, usersControllers.remove);

/**
 * Path: '/sessions'
 */
const sessionsController = new SessionsControllers();

routes.post(
  '/sessions',
  celebrate({ body: signInSchema }),
  sessionsController.signIn
);

export { routes };
