import { Router } from 'express';

import { MainController } from './core/controllers/MainController';
import { UsersControllers } from './core/controllers/UsersControllers';

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

routes.post('/users', usersControllers.create);

export { routes };
