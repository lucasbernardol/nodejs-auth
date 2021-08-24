import { NextFunction, Request, Response } from 'express';
import httpError, { Unauthorized, BadRequest } from 'http-errors';

import {
  verify,
  VerifyOptions,
  Secret,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';

import { promisify } from 'util';

export const isFunction = (value: any) => {
  return typeof value === 'function';
};

export interface Options {
  /**
   * @default 'authorization'
   */
  header?: string;
  secret: string;
  avaliableHeaders?: string[];
  verifyOptions?: VerifyOptions;
  credentialsRequired?: boolean;
  /**
   * - Optional synchronous function, used to search token in
   * request object `query`, `headers`, etc.
   */
  tokenInRequest?: (request: Request, defaultHeader: string) => string;
  /**
   * - "jwtPayload.sub"
   * @default true
   */
  containsId?: boolean;
}

export interface Decoded {
  /**
   * - unique identifier for user authentication, ID
   */
  id: string | null;
  decoded: JwtPayload | any;
}

export function authenticate(options: Options) {
  /**
   * - RegExp, select whitespaces
   */
  const separator = /\s/;

  /**
   * - RegExp, validate "Bearer" prefix.
   */
  const regExpBearerValidation = /^Bearer$/i;

  function avaliableHeadersInRequest(request: Request, headers: string[]) {
    let authorization: string = null;

    for (let header of headers) {
      const validHeaderName = header.trim().toLowerCase();

      const headerInRequest = validHeaderName in request.headers;

      if (headerInRequest) {
        /**
         * - get the first header found;
         */
        authorization = request.get(validHeaderName);
        break;
      }
    }

    return authorization;
  }

  function getUserIdentifier(decoded: JwtPayload, completed: boolean): string {
    return completed ? decoded.payload.sub : decoded.sub;
  }

  /**
   * @function
   */
  return async (request: Request, response: Response, next: NextFunction) => {
    const {
      header = 'authorization',
      avaliableHeaders = [],
      tokenInRequest,
      credentialsRequired = true,
    } = options;

    /**
     * - token, (JWT)
     */
    let authorizationToken: string = null;

    const isTokenCallBack = tokenInRequest ? isFunction(tokenInRequest) : null;

    if (isTokenCallBack) {
      try {
        authorizationToken = tokenInRequest(request, header);
      } catch (error) {
        return next(error);
      }
    }

    const hasHeadersOrEmptyToken = !authorizationToken && !!request.headers;

    if (hasHeadersOrEmptyToken) {
      const isArray =
        Array.isArray(avaliableHeaders) && avaliableHeaders.length >= 1;

      const authorizationHeader = isArray
        ? avaliableHeadersInRequest(request, avaliableHeaders)
        : request.get(header);

      if (authorizationHeader) {
        const authorizationSplitted = authorizationHeader.split(separator);

        const authorizationHeaderLength = authorizationSplitted.length !== 2;

        if (authorizationHeaderLength) {
          return next(
            new BadRequest('Token Malformed, Header: Bearer [token]')
          );
        }

        const [bearer, token] = authorizationSplitted;

        const isBearer = regExpBearerValidation.test(bearer);

        if (!isBearer) {
          return next(
            new Unauthorized('Token, Malformed, Header: Bearer [token]')
          );
        }

        authorizationToken = token;
      } else {
        if (credentialsRequired) {
          return next(new Unauthorized('Token not provided'));
        }

        return next();
      }
    }

    /**
     * - decoded, "request.user"
     */
    let user: Decoded;

    try {
      const { secret, verifyOptions, containsId = true } = options;

      const verifyAsync = promisify<string, Secret, VerifyOptions, JwtPayload>(
        verify
      );

      /**
       * - merged, options (JWT)
       */
      const merged = {
        ...verifyOptions,
      };

      const decoded = await verifyAsync(authorizationToken, secret, merged);

      const isCompleted = verifyOptions?.complete;

      const id = containsId ? getUserIdentifier(decoded, isCompleted) : null;

      const properties = {
        id,
        decoded,
      };

      user = properties;
    } catch (error) {
      const isTokenExpiredError = error instanceof TokenExpiredError;

      if (isTokenExpiredError) {
        const { expiredAt } = error;

        const message = 'Token expired at:' + expiredAt;

        return next(httpError(401, message, { expiredAt }));
      }

      const isTokenNotBeforeError = error instanceof NotBeforeError;

      if (isTokenNotBeforeError) {
        const { date } = error;

        return next(httpError(401, 'Token not active', { date }));
      }

      return next(new Unauthorized('Token invalid'));
    }

    /**
     * - "request.user"
     */
    Object.assign(request, { user });

    return next();
  };
}
