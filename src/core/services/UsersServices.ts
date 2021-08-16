import { classToPlain } from 'class-transformer';
import { getCustomRepository } from 'typeorm';

import { UsersRepositories } from '../repositories/UsersRepositories';
import { paginate } from '../utilities/paginate';

export interface Pagination {
  limit: number;
  page: number;
}

/**
 * @class UsersServices
 */
class UsersServices {
  async list(options: Pagination) {
    const { limit, page } = options;

    const usersRepositories = getCustomRepository(UsersRepositories);

    const total = await usersRepositories.count();

    const { offSet, range, pagination } = paginate({ total, page, limit });

    const accountResults = await usersRepositories.find({
      take: pagination.limit,
      skip: offSet,
    });

    const accounts = accountResults.map((account) => classToPlain(account));

    return { accounts, meta: { pagination, range } };
  }
}

export { UsersServices };
