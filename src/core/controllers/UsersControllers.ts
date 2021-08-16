import { NextFunction, Request, Response } from 'express';

import { UsersServices } from '../services/UsersServices';

/**
 * @class UsersControllers
 */
class UsersControllers {
  constructor(private services = new UsersServices()) {}

  async all(request: Request, response: Response, next: NextFunction) {
    try {
      const services = new UsersServices();

      const { accounts, meta } = await services.list();

      return response.json({ meta, accounts });
    } catch (error) {
      return next(error);
    }
  }
}

export { UsersControllers };
