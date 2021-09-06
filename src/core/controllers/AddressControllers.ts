import { NextFunction, Request, Response } from 'express';

import { AddressServices } from '../services/AddressServices';

/**
 * @class AddressControllers
 */
class AddressControllers {
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

      return response.status(201).json(address);
    } catch (error) {
      return next(error);
    }
  }
}

export { AddressControllers };
