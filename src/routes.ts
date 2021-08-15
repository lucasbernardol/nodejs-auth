import { Router } from 'express';
import { MainController } from './core/controllers/MainController';

const routes = Router();

/**
 * Path: '/'
 */
const mainController = new MainController();

routes.get('/', mainController.main);

export { routes };
