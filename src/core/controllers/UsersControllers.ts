import { NextFunction, Request, Response } from 'express';

import { UsersServices } from '../services/UsersServices';

/**
 * @class UsersControllers
 */
class UsersControllers {
  async all(request: Request, response: Response, next: NextFunction) {
    try {
      const { page, limit } = request.query;

      const services = new UsersServices();

      const { accounts, meta } = await services.list({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      });

      return response.json({ meta, accounts });
    } catch (error) {
      return next(error);
    }
  }
}

export { UsersControllers };
