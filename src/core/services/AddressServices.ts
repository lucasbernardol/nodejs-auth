import { getCustomRepository } from 'typeorm';
import { BadRequest } from 'http-errors';
import { paginate } from 'paging-util';

import { AddressRepositories } from '../repositories/AddressRepositories';

export interface Address {
  id?: string;
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
export class AddressServices {
  public repositories: AddressRepositories;

  public constructor() {
    this.repositories = getCustomRepository(AddressRepositories);
  }

  /**
   * @public all
   */
  async all(context: ListContext) {
    const { id, limit, page } = context;

    const total = await this.repositories.count({ userId: id });

    const { range, pagination, offSet } = paginate({ total, page, limit });

    const address = await this.repositories.find({
      where: {
        userId: id,
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
    const addressResult = await this.repositories.findOne(id);

    return addressResult ? addressResult : null;
  }

  /**
   * @public create
   */
  async create(id: string, context: Address) {
    const { city, street, district, zipcode, description, number, uf } =
      context;

    const addressRepositories = getCustomRepository(AddressRepositories);

    const addressInstance = addressRepositories.create({
      city,
      street,
      district,
      zipcode,
      description,
      number,
      uf,
      userId: id,
    });

    const address = await addressRepositories.save(addressInstance);

    return {
      address,
    };
  }

  async update(id: string, context: Address) {
    const { city, street, district, zipcode, description, number, uf } =
      context;

    const address = await this.repositories.findOne(id);

    if (!address) throw new BadRequest('No address was found!');

    const { affected: updated } = await this.repositories.update(id, {
      city,
      street,
      district,
      zipcode,
      uf,
      number,
      description,
    });

    return {
      updated,
    };
  }

  /**
   * @public delete
   */
  async delete(id: string) {
    const { affected: deleted } = await this.repositories.delete(id);

    return {
      deleted,
    };
  }
}
