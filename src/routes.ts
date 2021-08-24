import { Router } from 'express';
import { celebrate } from 'celebrate';

import { jwtConfig } from './config/jsonwebtoken';

import { MainController } from './core/controllers/MainController';
import { SessionsControllers } from './core/controllers/SessionsControllers';
import { UsersControllers } from './core/controllers/UsersControllers';
import { AlterControllers } from './core/controllers/AlterControllers';

import { account } from './core/validators/UsersValidators';

import { authenticate } from './core/middlewares/ensureAuthentication';

const authentication = authenticate({
  secret: jwtConfig.secret,
  avaliableHeaders: ['authorization'],
});

const { signUpSchema, signInSchema, deleteSchema, changeSchema } = account.body;

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

routes.delete(
  '/users',
  authentication,
  celebrate({ body: deleteSchema }),
  usersControllers.remove
);

/**
 * Path: '/sessions'
 */
const sessionsController = new SessionsControllers();

routes.post(
  '/sessions',
  celebrate({ body: signInSchema }),
  sessionsController.signIn
);

/**
 * Path: '/alter'
 */
const alterControllers = new AlterControllers();

routes.post(
  '/alter/change',
  authentication,
  celebrate({ body: changeSchema }),
  alterControllers.change
);

export { routes };
