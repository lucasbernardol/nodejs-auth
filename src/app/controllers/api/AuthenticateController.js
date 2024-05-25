import { promisify } from 'node:util';

import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { User } from '../../models/User.js';
import { gravatar } from '../../utils/gravatar.js';
import tokenConfigs from '../../../configs/token.js';
import { milliseconds } from '../../utils/milliseconds.js';
import { userMap } from '../../utils/userMap.js';

const singJwt = promisify(jsonwebtoken.sign);

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
        return response.status(400).json({ message: 'Invalid email address' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        gravatar: gravatar(email),
        password: passwordHash,
      });

      return response.status(200).json(userMap(user));
    } catch (error) {
      return next(error);
    }
  }

  async login(request, response, next) {
    try {
      const { email, password } = request.body;

      const user = await User.findOne({ email }).select(['+password']).lean();

      if (!user) {
        return response.status(400).json({
          message: 'Invalid email/password',
        });
      }

      const isValidPasswordHash = await bcrypt.compare(password, user.password);

      if (!isValidPasswordHash) {
        return response.status(400).json({
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

      return response.status(200).json(userMap(user));
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

      return response.status(204).end();
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthenticateController();