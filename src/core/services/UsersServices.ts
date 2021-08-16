import { classToPlain } from 'class-transformer';
import { getCustomRepository } from 'typeorm';

import { UsersRepositories } from '../repositories/UsersRepositories';

/**
 * @class UsersServices
 */
class UsersServices {
  async list() {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const accountResults = await usersRepositories.find();

    const accounts = accountResults.map((account) => classToPlain(account));

    return { accounts, meta: {} };
  }
}

export { UsersServices };
