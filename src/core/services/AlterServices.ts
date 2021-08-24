import { getCustomRepository } from 'typeorm';
import { BadRequest } from 'http-errors';
import { compare, hash } from 'bcryptjs';

import { UsersRepositories } from '../repositories/UsersRepositories';

export interface UpdateContext {
  id: string;
  oldPassword: string;
  password: string;
}

/**
 * @class
 */
class AlterServices {
  private salt: number = 8;

  async change(context: UpdateContext) {
    const { id, oldPassword, password } = context;

    const usersRepositories = getCustomRepository(UsersRepositories);

    const account = await usersRepositories.findOne(id);

    const isMatch = account
      ? await compare(oldPassword, account.password)
      : false;

    if (!isMatch) throw new BadRequest();

    /**
     * - hash, update password
     */
    const passwordHash = await hash(password, this.salt);

    const { affected: updated } = await usersRepositories.update(id, {
      password: passwordHash,
    });

    return { id, updated };
  }
}

export { AlterServices };
