import { NextFunction, Request, Response } from 'express';

import { AddressServices } from '../services/AddressServices';

/**
 * @class AddressControllers
 */
export class AddressControllers {
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

  /**
   *  @public findByPk
   */
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

      const { address } = await services.create(id, {
        city,
        street,
        district,
        zipcode,
        description,
        number,
        uf,
      });

      return response.json(address);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @public update
   */
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const { city, street, district, zipcode, description, number, uf } =
        request.body;

      const services = new AddressServices();

      const { updated } = await services.update(id, {
        city,
        street,
        district,
        zipcode,
        description,
        number,
        uf,
      });

      return response.json({ updated });
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
