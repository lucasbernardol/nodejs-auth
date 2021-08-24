import { NextFunction, Request, Response } from 'express';

import { AlterServices } from '../services/AlterServices';

/**
 * @class
 */
class AlterControllers {
  async change(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.user;

      const { oldPassword, password } = request.body;

      const services = new AlterServices();

      const { updated } = await services.change({
        id,
        oldPassword,
        password,
      });

      return response.json({ id, updated });
    } catch (error) {
      return next(error);
    }
  }
}

export { AlterControllers };
