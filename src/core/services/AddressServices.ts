import { getCustomRepository } from 'typeorm';
import { AddressRepositories } from '../repositories/AddressRepositories';

export interface Address {
  /**
   * - ID, unique identifier.
   */
  id: string;
  zipcode: string;
  city: string;
  street: string;
  district: string;
  description?: string;
  number?: number;
  uf?: string;
}

/**
 * @class AddressServices
 */
class AddressServices {
  async create(addresses: Address) {
    const { id, city, street, district, zipcode, description, number, uf } =
      addresses;

    const addressRepositories = getCustomRepository(AddressRepositories);

    const addressInstance = addressRepositories.create({
      userId: id,
      city,
      street,
      district,
      zipcode,
      description,
      number,
      uf,
    });

    const address = await addressRepositories.save(addressInstance);

    return {
      address,
    };
  }
}

export { AddressServices };
