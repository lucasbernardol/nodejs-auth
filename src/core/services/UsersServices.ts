import { classToPlain } from 'class-transformer';
import { getCustomRepository } from 'typeorm';
import { BadRequest } from 'http-errors';
import { paginate } from 'paging-util';

import bcrypt from 'bcryptjs';

import { UsersRepositories } from '../repositories/UsersRepositories';

export type Create = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type Delete = {
  id: string;
  password: string;
};

export type All = {
  limit: number;
  page: number;
};

/**
 * @class UsersServices
 */
export class UsersServices {
  private salt: number = 8;

  constructor(private repositories = getCustomRepository(UsersRepositories)) {}

  /**
   * @public list
   */
  async list(options: All) {
    const { limit, page } = options;

    const total = await this.repositories.count();

    const { offSet, pagination, range } = paginate({ total, page, limit });

    const usersResults = await this.repositories.find({
      skip: offSet,
      take: pagination.limit,
    });

    const users = usersResults.map((userObject) => classToPlain(userObject));

    return {
      meta: {
        offSet,
        pagination,
        range,
      },
      users,
    };
  }

  /**
   * @public create
   */
  async create(context: Create) {
    const { name, username, email, password: plainText } = context;

    const account = await this.repositories.findOne({
      where: [{ username }, { email }],
    });

    if (account) throw new BadRequest('This email address already exists');

    const password = await bcrypt.hash(plainText, this.salt);

    const accountInstance = this.repositories.create({
      name,
      email,
      username,
      password,
    });

    const { id } = await this.repositories.save(accountInstance);

    return {
      id,
    };
  }

  /**
   * @public find
   */
  async find(id: string) {
    const account = await this.repositories.findOne(id);

    return account ? classToPlain(account) : null;
  }

  /**
   * @public delete
   */
  async delete(context: Delete) {
    const { id, password } = context;

    const user = await this.repositories.findOne(id);

    const isMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!isMatch) throw new BadRequest('Invalid passwords');

    const { affected } = await this.repositories.delete(id);

    return {
      id,
      deleted: affected,
    };
  }
}
