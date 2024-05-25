import { promisify } from 'node:util';
import jsonwebtoken from 'jsonwebtoken';

import tokenConfigs from '../../configs/token.js';

const verifyJwt = promisify(jsonwebtoken.verify);

export function isAuthenticaded() {
  return (request, response, next) => {
    if (request.cookies?.token) {
      return response.redirect('/dashboard');
    }

    return next();
  };
}

export function authenticate({ errorPath } = {}) {
  const errorRoutePath = errorPath ?? '/sign-in';

  /**
   * Render Home page
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @param {import('express').NextFunction} next
   * @returns
   */
  return async (request, response, next) => {
    const token = request.cookies?.token;

    if (!token) {
      return response.redirect('/sign-in');
    }

    try {
      const payload = await verifyJwt(token, tokenConfigs.secret);

      request.userId = payload.id;

      return next();
    } catch (error) {
      // Ignore any errors

      response.cookie('token', '', { maxAge: 0 }); // Remove bad cookie
      response.redirect(errorRoutePath);
    }
  };
}
