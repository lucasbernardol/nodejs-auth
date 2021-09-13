import { sign, Secret, SignOptions } from 'jsonwebtoken';
import { classToPlain } from 'class-transformer';
import { getCustomRepository } from 'typeorm';
import { BadRequest } from 'http-errors';
import bcrypt from 'bcryptjs';

import dayjs from 'dayjs';

import { promisify } from 'util';

import { UsersRepositories } from '../repositories/UsersRepositories';
import { jwtConfig } from '../../config/jsonwebtoken';

export type Authenticate = {
  email: string;
  password: string;
};

/**
 * @class SessionsServices
 */
export class SessionsServices {
  constructor(private repositories = getCustomRepository(UsersRepositories)) {}

  /**
   * @public authenticate
   */
  async authenticate(context: Authenticate) {
    const { email, password: plainText } = context;

    const account = await this.repositories.findOne({ email });

    const isMatch = account
      ? await bcrypt.compare(plainText, account.password)
      : false;

    if (!isMatch) throw new BadRequest('No account found with this email');

    /**
     * - Sign token
     */
    const signAsync = promisify<any, Secret, SignOptions, string>(sign);

    const { secret, expires } = jwtConfig;

    const accessToken = await signAsync({}, secret, {
      expiresIn: expires,
      subject: account.id,
    });

    const accessTokenExpiresInHours = Math.floor(expires / 3600);

    const expiration = dayjs().add(accessTokenExpiresInHours, 'hours').toDate();

    return {
      account: classToPlain(account),
      session: {
        token: accessToken,
        expires: expiration,
      },
    };
  }
}
