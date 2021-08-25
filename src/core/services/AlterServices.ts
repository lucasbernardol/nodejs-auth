import dayjs from 'dayjs';
import { classToPlain } from 'class-transformer';

import { getCustomRepository } from 'typeorm';
import { BadRequest } from 'http-errors';
import { compare, hash } from 'bcryptjs';

import { randomBytesAsync } from '../utilities/randomBytesAsync';

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
  /**
   * - bcrypt, salt length
   */
  private salt: number = 8;

  /**
   * - token size
   */
  private size: number = 22;

  async forgot(email: string) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const account = await usersRepositories.findOne({ email });

    if (!account) throw new BadRequest();

    const { id } = account;

    /**
     * - ramdomBytes async
     */
    const token = await randomBytesAsync(this.size);

    const expires = dayjs().add(30, 'minutes').toDate();

    const { affected } = await usersRepositories.update(id, { token, expires });

    return {
      user: classToPlain(account),
      token,
      expires,
      updated: affected,
    };
  }

  async change(context: UpdateContext) {
    const { id, oldPassword, password: plain } = context;

    const usersRepositories = getCustomRepository(UsersRepositories);

    const account = await usersRepositories.findOne(id);

    const isMatch = account
      ? await compare(oldPassword, account.password)
      : false;

    if (!isMatch) throw new BadRequest();

    /**
     * - hash, update passwords
     */
    const password = await hash(plain, this.salt);

    const { affected } = await usersRepositories.update(id, { password });

    return {
      updated: affected,
    };
  }
}

export { AlterServices };
