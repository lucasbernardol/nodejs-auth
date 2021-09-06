import { Router } from 'express';
import { celebrate } from 'celebrate';

import { jwtConfig } from './config/jsonwebtoken';

import { MainController } from './core/controllers/MainController';
import { SessionsControllers } from './core/controllers/SessionsControllers';
import { UsersControllers } from './core/controllers/UsersControllers';
import { AlterControllers } from './core/controllers/AlterControllers';
import { AddressControllers } from './core/controllers/AddressControllers';

import { account } from './core/validators/UsersValidators';

import { authenticate } from './core/middlewares/ensureAuthentication';

const secure = authenticate({
  secret: jwtConfig.secret,
  headers: ['authorization'],
});

const {
  signUpSchema,
  signInSchema,
  deleteSchema,
  changeSchema,
  forgotShema,
  resetSchema,
} = account.body;

const routes = Router();

/**
 * Path: "/"
 */
const mainController = new MainController();

routes.get('/', mainController.main);

/**
 * Path: "/sessions"
 */
const sessionController = new SessionsControllers();

routes.post(
  '/sessions',
  celebrate({ body: signInSchema }),
  sessionController.signIn
);

/**
 * Path: "/users"
 */
const usersControllers = new UsersControllers();

routes.get('/users', secure, usersControllers.all);
routes.get('/users/me', secure, usersControllers.me);
routes.get('/users/:id', secure, usersControllers.findId);

routes.post(
  '/users',
  celebrate({ body: signUpSchema }),
  usersControllers.create
);

routes.delete(
  '/users',
  secure,
  celebrate({ body: deleteSchema }),
  usersControllers.remove
);

/**
 * Path: "/alter"
 */
const alterControllers = new AlterControllers();

routes.post(
  '/alter/change',
  secure,
  celebrate({ body: changeSchema }),
  alterControllers.change
);

routes.post(
  '/alter/forgot',
  celebrate({ body: forgotShema }),
  alterControllers.forgot
);

routes.post(
  '/alter/reset',
  celebrate({ body: resetSchema }),
  alterControllers.reset
);

/**
 * Path: "/addresses"
 */

const addressController = new AddressControllers();

routes.post('/address', secure, addressController.create);

export { routes };
