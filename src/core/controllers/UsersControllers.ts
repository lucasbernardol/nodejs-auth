import { NextFunction, Request, Response } from 'express';

import { UsersServices } from '../services/UsersServices';

/**
 * @class UsersControllers
 */
export class UsersControllers {
  /**
   * @public all
   */
  async all(request: Request, response: Response, next: NextFunction) {
    try {
      const { page, limit } = request.query as any;

      const services = new UsersServices();

      const { users, meta } = await services.list({ page, limit });

      return response.json({ users, meta });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @public findByPk
   */
  async findByPk(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const services = new UsersServices();

      const account = await services.find(id);

      return response.json(account);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @public create
   */
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, username, email, password } = request.body;

      const services = new UsersServices();

      const { id } = await services.create({ name, username, email, password });

      return response.json({ id });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @public me
   */
  async me(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.user;

      const services = new UsersServices();

      const account = await services.find(id);

      return response.json(account);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @public remove
   */
  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.user;

      const { password } = request.body;

      const services = new UsersServices();

      const { deleted } = await services.delete({ id, password });

      return response.json({ id, deleted });
    } catch (error) {
      return next(error);
    }
  }
}
