import { paginate } from 'paging-util';
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

export interface ListContext {
  id: string;
  page: number;
  limit: number;
}

/**
 * @class AddressServices
 */
class AddressServices {
  /**
   * @public all
   */
  async all({ page, limit, id: userId }: ListContext) {
    const addressesRepositories = getCustomRepository(AddressRepositories);

    const total = await addressesRepositories.count({ userId });

    const { range, pagination, offSet } = paginate({ total, page, limit });

    const address = await addressesRepositories.find({
      where: {
        userId,
      },
      skip: offSet,
      take: pagination.limit,
    });

    return {
      address,
      meta: {
        offSet,
        pagination,
        range,
      },
    };
  }

  /**
   * @public create
   */
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

  /**
   * @public delete
   */
  async delete(id: string) {
    const addressesRepositories = getCustomRepository(AddressRepositories);

    const { affected: deleted } = await addressesRepositories.delete(id);

    return {
      deleted,
    };
  }
}

export { AddressServices };
