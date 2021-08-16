import { BadRequest } from 'http-errors';
import bcrypt from 'bcryptjs';
import { classToPlain } from 'class-transformer';
import { getCustomRepository } from 'typeorm';

import { UsersRepositories } from '../repositories/UsersRepositories';
import { paginate } from '../utilities/paginate';

export interface Pagination {
  limit: number;
  page: number;
}

export interface CreateUserContext {
  name: string;
  username: string;
  email: string;
  password: string;
}

/**
 * @class UsersServices
 */
class UsersServices {
  /**
   * Bcrypt salt
   */
  private salt: number = 8;

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

  async create(context: CreateUserContext) {
    const { name, username, email, password: plainText } = context;

    const usersRepositories = getCustomRepository(UsersRepositories);

    /**
     * - where TypeORM
     */
    const where = [{ username }, { email }];

    const account = await usersRepositories.findOne({ where });

    if (account) throw new BadRequest();

    /**
     * - hash
     */
    const password = await bcrypt.hash(plainText, this.salt);

    const accountInstance = usersRepositories.create({
      name,
      email,
      username,
      password,
    });

    const { id } = await usersRepositories.save(accountInstance);

    return { id };
  }
}

export { UsersServices };
