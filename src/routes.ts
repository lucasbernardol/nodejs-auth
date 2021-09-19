import { Router } from 'express';
import { celebrate } from 'celebrate';

import { jwtConfig } from './config/jsonwebtoken';

import { MainController } from './core/controllers/MainController';
import { SessionsControllers } from './core/controllers/SessionsControllers';
import { UsersControllers } from './core/controllers/UsersControllers';
import { AlterControllers } from './core/controllers/AlterControllers';
import { AddressControllers } from './core/controllers/AddressControllers';

import usersSchemas from './core/validators/users.validators';
import addressSchemas from './core/validators/address.validators';

import { authenticate } from './core/middlewares/ensureAuthentication';
import { queryParams } from './core/middlewares/paginate';

const routes = Router();

const secure = authenticate({
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

const { signIn } = usersSchemas.body;

routes.post('/sessions', celebrate({ body: signIn }), sessions.signIn);

/**
 * - authenticated
 */
routes.use(secure);

/**
 * - Path: "/users"
 */
const users = new UsersControllers();

const { create, delete: deleteSchema } = usersSchemas.body;

routes.get('/users', pagination, users.all);
routes.get('/users/me', users.me);
routes.get('/users/:id', users.findByPk);

routes.post('/users', celebrate({ body: create }), users.create);
routes.delete('/users', celebrate({ body: deleteSchema }), users.remove);

/**
 * - Path: "/alter"
 */
const alter = new AlterControllers();

const { change, forgot, reset } = usersSchemas.body;

routes.post('/alter/change', celebrate({ body: change }), alter.change);
routes.post('/alter/forgot', celebrate({ body: forgot }), alter.forgot);
routes.post('/alter/reset', celebrate({ body: reset }), alter.reset);

/**
 * - Path: "/address"
 */
const address = new AddressControllers();

const { create: createSchema } = addressSchemas.body;

routes.get('/address', pagination, address.list);
routes.get('/address/:id', address.findByPk);
routes.post('/address', celebrate({ body: createSchema }), address.create);
routes.put('/address/:id', address.update);
routes.delete('/address/:id', address.delete);

export { routes };
