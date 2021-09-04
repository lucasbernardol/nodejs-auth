import { NextFunction, Request, Response } from 'express';

import { SessionsServices } from '../services/SessionsServices';

/**
 * @class SessionsControllers
 */
class SessionsControllers {
  async signIn(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;

      const services = new SessionsServices();

      const { account, session } = await services.authenticate({
        email,
        password,
      });

      return response.json({ account, session });
    } catch (error) {
      return next(error);
    }
  }
}

export { SessionsControllers };
