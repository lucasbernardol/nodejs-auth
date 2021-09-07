import { NextFunction, Request, Response } from 'express';

import { AddressServices } from '../services/AddressServices';

/**
 * @class AddressControllers
 */
class AddressControllers {
  /**
   *  @public list
   */
  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const { page, limit } = request.query as any;

      const { id } = request.user;

      const services = new AddressServices();

      const { address, meta } = await services.all({ id, limit, page });

      return response.json({ address, meta });
    } catch (error) {
      return next(error);
    }
  }

  async findByPk(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const services = new AddressServices();

      const address = await services.find(id);

      return response.json(address);
    } catch (error) {
      return next(error);
    }
  }

  /**
   *  @public create
   */
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { city, street, district, zipcode, description, number, uf } =
        request.body;

      const { id } = request.user;

      const services = new AddressServices();

      const { address } = await services.create({
        city,
        street,
        district,
        zipcode,
        description,
        number,
        uf,
        id,
      });

      return response.json(address);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @public delete
   */
  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const services = new AddressServices();

      const { deleted } = await services.delete(id);

      return response.json({ deleted });
    } catch (error) {
      return next(error);
    }
  }
}

export { AddressControllers };
