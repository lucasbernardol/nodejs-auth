import bcrypt from 'bcryptjs';
import { paginate } from 'paging-util';
import { BadRequest } from 'http-errors';
import { getCustomRepository } from 'typeorm';
import { classToPlain } from 'class-transformer';

import { UsersRepositories } from '../repositories/UsersRepositories';

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

    /**
     * - total items
     */
    const total = await usersRepositories.count();

    const { offSet, pagination, range } = paginate({ total, page, limit });

    const results = await usersRepositories.find({
      skip: offSet,
      take: pagination.limit,
    });

    return {
      meta: {
        offSet,
        pagination,
        range,
      },
      users: results.map((user) => classToPlain(user)),
    };
  }

  async create(context: CreateUserContext) {
    const { name, username, email, password: plainText } = context;

    const usersRepositories = getCustomRepository(UsersRepositories);

    /**
     * - where
     */
    const where = [{ username }, { email }];

    const account = await usersRepositories.findOne({ where });

    if (account) throw new BadRequest('This email address already exists');

    const password = await bcrypt.hash(plainText, this.salt);

    const accountInstance = usersRepositories.create({
      name,
      email,
      username,
      password,
    });

    const { id } = await usersRepositories.save(accountInstance);

    return {
      id,
    };
  }

  /**
   * @public
   */
  async find(id: string) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const account = await usersRepositories.findOne(id);

    return account ? classToPlain(account) : null;
  }

  /**
   * @public
   */
  async delete(context: DeleteContext) {
    const { id, password } = context;

    const usersRepositories = getCustomRepository(UsersRepositories);

    const account = await usersRepositories.findOne(id);

    const isMatch = account
      ? await bcrypt.compare(password, account.password)
      : false;

    if (!isMatch) throw new BadRequest('Invalid email or password');

    const { affected: deleted } = await usersRepositories.delete(id);

    return {
      id,
      deleted,
    };
  }
}

export { UsersServices };
