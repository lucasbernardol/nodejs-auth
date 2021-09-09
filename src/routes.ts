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
import { queryParams } from './core/middlewares/paginate';

const {
  signUpSchema,
  signInSchema,
  deleteSchema,
  changeSchema,
  forgotShema,
  resetSchema,
} = account.body;

const routes = Router();

const authenticated = authenticate({
  secret: jwtConfig.secret,
  headers: ['authorization'],
  containsId: true,
  //tokenRequest: (request) => String(request.query.token).split(' ')[1],
});

const pagination = queryParams();

/**
 * Path: "/"
 */
const mainController = new MainController();

routes.get('/', mainController.main);

/**
 * Path: "/sessions"
 */
const sessions = new SessionsControllers();

routes.post('/sessions', celebrate({ body: signInSchema }), sessions.signIn);

/**
 * Path: "/users"
 */
const users = new UsersControllers();

routes.get('/users', authenticated, pagination, users.all);
routes.get('/users/me', authenticated, users.me);
routes.get('/users/:id', authenticated, users.findId);

routes.post('/users', celebrate({ body: signUpSchema }), users.create);

routes.delete(
  '/users',
  authenticated,
  celebrate({ body: deleteSchema }),
  users.remove
);

/**
 * Path: "/alter"
 */
const alter = new AlterControllers();

routes.post(
  '/alter/change',
  authenticated,
  celebrate({ body: changeSchema }),
  alter.change
);

routes.post('/alter/forgot', celebrate({ body: forgotShema }), alter.forgot);
routes.post('/alter/reset', celebrate({ body: resetSchema }), alter.reset);

/**
 * Path: "/address"
 */
const address = new AddressControllers();

routes.get('/address', authenticated, pagination, address.list);
routes.get('/address/:id', authenticated, address.findByPk);

routes.post('/address', authenticated, address.create);
routes.put('/address/:id', authenticated, address.update);
routes.delete('/address/:id', authenticated, address.delete);

export { routes };
