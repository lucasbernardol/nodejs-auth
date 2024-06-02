import { promisify } from 'node:util';

import { isValidObjectId } from 'mongoose';

import { StatusCodes } from 'http-status-codes';

import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { User } from '../../models/User.js';
import { gravatar } from '../../utils/gravatar.js';
import tokenConfigs from '../../../configs/token.js';
import { milliseconds } from '../../utils/milliseconds.js';
import { userMap } from '../../utils/userMap.js';

import { randomToken } from '../../utils/randomToken.js';
import sendMail from '../../utils/sendMail.js';

const singJwt = promisify(jsonwebtoken.sign);

const unix = () => Math.floor(Date.now() / 1000); // Unix timestamp

export class AuthenticateController {
  /**
   * Register user (api route).
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @param {import('express').NextFunction} next
   * @returns
   */
  async register(request, response, next) {
    try {
      const { name, email, password } = request.body;

      const userExists = await User.findOne({ email }).select(['_id']);

      if (userExists) {
        return response
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Invalid email address' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        gravatar: gravatar(email),
        password: passwordHash,
      });

      return response.status(StatusCodes.CREATED).json(userMap(user));
    } catch (error) {
      return next(error);
    }
  }

  async login(request, response, next) {
    try {
      const { email, password } = request.body;

      const user = await User.findOne({ email }).select(['+password']).lean();

      if (!user) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          message: 'Invalid email/password',
        });
      }

      const isValidPasswordHash = await bcrypt.compare(password, user.password);

      if (!isValidPasswordHash) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          message: 'Invalid email/password',
        });
      }

      // token
      const token = await singJwt({ id: user._id }, tokenConfigs.secret, {
        expiresIn: tokenConfigs.expiresIn,
      });

      response.cookie('token', token, {
        httpOnly: true,
        maxAge: milliseconds(tokenConfigs.expiresIn),
      });

      return response.status(StatusCodes.OK).json(userMap(user));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Logout
   *
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @param {import('express').NextFunction} next
   * @returns
   */
  async logout(request, response, next) {
    try {
      response.clearCookie('token'); // Remove current cookie

      return response.status(StatusCodes.NO_CONTENT).end();
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Logout
   *
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @param {import('express').NextFunction} next
   * @returns
   */
  async recovery(request, response, next) {
    try {
      const { email } = request.body;

      const user = await User.findOne({ email }).select([
        '_id',
        'recoveryExpiresAt',
      ]);

      if (!user) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Account not found!',
        });
      }

      const currentUnix = unix(); // Unix seconds

      if (user?.recoveryExpiresAt && user?.recoveryExpiresAt > currentUnix) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          message: 'Check your email!',
        });
      }

      const { token } = await randomToken();

      // Using dayjs
      const recoveryExpiresAt = currentUnix + 5 * 60;

      await User.updateOne(
        { email },
        {
          $set: {
            recoveryToken: token,
            recoveryExpiresAt,
            recoverySignAt: currentUnix,
          },
        },
      );

      await sendMail({
        email,
        resetPasswordUrl: `${process.env.HOST}/reset-password/${user._id}?token=${token}`,
      });

      return response.status(StatusCodes.ACCEPTED).end();
    } catch (error) {
      // log
      return next(error);
    }
  }

  async reset(request, response, next) {
    try {
      const { userId } = request.params;
      const { token } = request.query;

      const { password, repeatPassword: _ } = request.body;

      if (!isValidObjectId(userId)) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          message: 'Invalid account',
        });
      }

      const user = await User.findById(userId).select([
        '_id',
        'recoveryToken',
        'recoveryExpiresAt',
      ]);

      if (!user || user?.recoveryToken !== token) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Invalid credentials!',
        });
      }

      const currentUnixTimestamp = unix();

      if (currentUnixTimestamp > user.recoveryExpiresAt) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Token expired!',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await User.updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            recoveryExpiresAt: null,
            recoveryToken: null,
            recoverySignAt: null,
            password: passwordHash,
          },
        },
      );

      return response.status(StatusCodes.ACCEPTED).end();
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}

export default new AuthenticateController();
