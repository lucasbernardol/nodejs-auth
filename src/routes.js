import { Router } from 'express';

import AppController from './app/controllers/AppController.js';

export const routes = Router();

routes.get('/', AppController.home);
