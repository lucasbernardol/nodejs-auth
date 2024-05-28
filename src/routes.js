import { Router } from 'express';

import AppController from './app/controllers/AppController.js';
import SessionController from './app/controllers/SessionController.js';

import DashboardController from './app/controllers/DashboardController.js';
import AuthenticateController from './app/controllers/api/AuthenticateController.js';

import {
  isAuthenticaded,
  authenticate,
} from './app/middlewares/authenticateMiddleware.js';

export const routes = Router();

routes.get('/', isAuthenticaded(), AppController.home);

/**
 * Auth
 */
routes.get('/sign-in', isAuthenticaded(), SessionController.signIn);
routes.get('/sign-up', isAuthenticaded(), SessionController.signUp);

routes.get('/forgot-password', isAuthenticaded(), SessionController.recovery);
routes.get('/reset-password', isAuthenticaded(), SessionController.reset);

/**
 * Dashboard routes
 */
routes.get('/dashboard', authenticate(), DashboardController.profile);

/**
 * API - routes (authentication)
 */
routes.post('/api/sessions/sign-in', AuthenticateController.login);
routes.post('/api/sessions/sign-up', AuthenticateController.register);
routes.delete(
  '/api/sessions/logout',
  authenticate(),
  AuthenticateController.logout,
);
