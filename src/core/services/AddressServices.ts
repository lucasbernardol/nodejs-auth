import { paginate } from 'paging-util';
import { getCustomRepository } from 'typeorm';
import { BadRequest } from 'http-errors';

import { AddressRepositories } from '../repositories/AddressRepositories';

export interface Address {
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
   * @public find
   */
  async find(id: string) {
    const addressesRepositories = getCustomRepository(AddressRepositories);

    return (await addressesRepositories.findOne(id)) || null;
  }

  /**
   * @public create
   * @param userId unique identifier
   */
  async create(userId: string, context: Address) {
    const { city, street, district, zipcode, description, number, uf } =
      context;

    const addressRepositories = getCustomRepository(AddressRepositories);

    const isAddress = await addressRepositories.findOne({ zipcode });

    if (isAddress) throw new BadRequest('Address was found with the zip code!');

    const addressInstance = addressRepositories.create({
      userId,
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

  async update(id: string, context: Address) {
    const addressesRepositories = getCustomRepository(AddressRepositories);

    console.log({ ...context });

    const address = await addressesRepositories.findOne(id);

    if (!address) throw new BadRequest('No address was found!');

    const { affected: updated } = await addressesRepositories.update(id, {
      ...context,
    });

    return {
      updated,
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
