import dayjs from 'dayjs';
import { getCustomRepository } from 'typeorm';
import { BadRequest } from 'http-errors';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { promisify } from 'util';

import { UsersRepositories } from '../repositories/UsersRepositories';
import { jwtConfig } from '../../config/jsonwebtoken';
import { classToPlain } from 'class-transformer';

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

    const isCorrectPassword = account
      ? await bcrypt.compare(plain, account.password)
      : false;

    if (!isCorrectPassword) throw new BadRequest();

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
