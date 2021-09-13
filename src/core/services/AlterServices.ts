import { getCustomRepository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { compare, hash } from 'bcryptjs';
import { BadRequest } from 'http-errors';
import dayjs from 'dayjs';

import { randomBytesAsync } from '../utilities/randomBytesAsync';
import { UsersRepositories } from '../repositories/UsersRepositories';

export type Update = {
  id: string;
  oldPassword: string;
  password: string;
};

export type Reset = {
  token: string;
  password: string;
};

/**
 * @class AlterServices
 */
export class AlterServices {
  /**
   * - bcrypt, salt length
   */
  private salt: number = 8;

  /**
   * - token size
   */
  private size: number = 22;

  constructor(private repositories = getCustomRepository(UsersRepositories)) {}

  /**
   * @public forgot
   */
  async forgot(email: string) {
    const account = await this.repositories.findOne({ email });

    if (!account) throw new BadRequest('No account found with this email');

    const { id } = account;

    /**
     * - ramdomBytes async
     */
    const token = await randomBytesAsync(this.size);

    const expires = dayjs().add(30, 'minutes').toDate();

    const { affected } = await this.repositories.update(id, { token, expires });

    return {
      user: classToPlain(account),
      token,
      expires,
      updated: affected,
    };
  }

  /**
   * @public reset
   */
  async reset(context: Reset) {
    const { token, password: plain } = context;

    const account = await this.repositories.findOne({ token });

    if (!account) throw new BadRequest('No account was found');

    const { expires, id } = account;

    /**
     * - Expiration
     */
    const isAfterExpiration = dayjs().isAfter(expires, 'milliseconds');

    if (isAfterExpiration) throw new BadRequest('Token expired!');

    const { affected } = await this.repositories.update(id, {
      token: null,
      expires: null,
      password: await hash(plain, this.salt),
    });

    return {
      updated: affected,
    };
  }

  async change(context: Update) {
    const { id, oldPassword, password: plain } = context;

    const usersRepositories = getCustomRepository(UsersRepositories);

    const account = await usersRepositories.findOne(id);

    const isMatch = account
      ? await compare(oldPassword, account.password)
      : false;

    if (!isMatch) throw new BadRequest('Invalid passwords');

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
