import dayjs from 'dayjs';
import bcrypt from 'bcryptjs';
import { promisify } from 'util';
import { BadRequest } from 'http-errors';
import { getCustomRepository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

import { UsersRepositories } from '../repositories/UsersRepositories';
import { jwtConfig } from '../../config/jsonwebtoken';

export interface AuthenticateContext {
  email: string;
  password: string;
}

/**
 * @class
 */
class SessionsServices {
  async authenticate(context: AuthenticateContext) {
    const { email, password: plain } = context;

    const usersRepositories = getCustomRepository(UsersRepositories);

    const account = await usersRepositories.findOne({ email });

    const isMatch = account
      ? await bcrypt.compare(plain, account.password)
      : false;

    if (!isMatch) throw new BadRequest('No account found with this email');

    /**
     * - Sign token
     */
    const signTokenAsync = promisify<any, Secret, SignOptions, string>(
      jwt.sign
    );

    const { secret, expires } = jwtConfig;

    const token = await signTokenAsync({}, secret, {
      expiresIn: expires,
      subject: account.id,
    });

    const tokenExpiresInDays = expires / 3600;

    const tokenExpires = dayjs().add(tokenExpiresInDays, 'hours').toDate();

    return {
      account: classToPlain(account),
      session: {
        token,
        expires: tokenExpires,
      },
    };
  }
}

export { SessionsServices };
