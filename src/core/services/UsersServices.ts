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

export interface DeleteContext {
  id: string;
  password: string;
}

/**
 * @class UsersServices
 */
class UsersServices {
  /**
   * - bcrypt salt
   */
  private salt: number = 8;

  async list(options: Pagination) {
    const { limit, page } = options;

    const usersRepositories = getCustomRepository(UsersRepositories);

    const total = await usersRepositories.count();

    const { offSet, range, pagination } = paginate({ total, page, limit });

    const accounts = await usersRepositories.find({
      take: pagination.limit,
      skip: offSet,
    });

    return {
      users: accounts.map((account) => classToPlain(account)),
      meta: {
        pagination,
        range,
      },
    };
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

  /**
   * @public
   */
  async find(id: string) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const account = await usersRepositories.findOne(id);

    return account ? classToPlain(account) : null;
  }

  async delete(context: DeleteContext) {
    const { id, password: plain } = context;

    const usersRepositories = getCustomRepository(UsersRepositories);

    const account = await usersRepositories.findOne(id);

    const is = account ? await bcrypt.compare(plain, account.password) : false;

    if (!is) throw new BadRequest();

    const { affected: deleted } = await usersRepositories.delete(id);

    return { id, deleted };
  }
}

export { UsersServices };
