import { NextFunction, Request, Response } from 'express';
import httpError, { Unauthorized, BadRequest } from 'http-errors';
import { promisify } from 'util';

import {
  verify,
  VerifyOptions,
  Secret,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';

import { isFunction } from '../utilities/isFunction';

export interface Options {
  /**
   * @default 'authorization'
   */
  header?: string;
  /**
   * - Available headers
   */
  headers?: string[];
  secret: string;
  verifyOptions?: VerifyOptions;
  credentialsRequired?: boolean;
  /**
   * - Optional synchronous function, used to search token in
   * request object `query`, `headers`, etc.
   */
  tokenRequest?: (request: Request, defaultHeader: string) => string;
  /**
   * - "jwtPayload.sub"
   * @default true
   */
  containsId?: boolean;
}

export interface Decoded {
  /**
   * - ID, unique identifier
   */
  id: string | null;
  decoded: JwtPayload | any;
}

export function authenticate(options: Options) {
  /**
   * - regular expression to select `whitespaces` from a string
   * @constant separator
   */
  const separator = /\s/;

  /**
   * - Regular expression to validate `Bearer`
   * @constant bearerTokenValidate
   */
  const bearerTokenValidate = /^Bearer$/i;

  function avaliableHeadersInRequest(request: Request, headers: string[]) {
    let authorizationToken: string = null;

    let interactionIndexes = 0;
    while (interactionIndexes < headers.length) {
      const authorizationHeader = headers[interactionIndexes].trim();

      const hasHeaderInRequest = authorizationHeader in request.headers;

      if (hasHeaderInRequest) {
        authorizationToken = request.get(authorizationHeader);
        break; // first header
      }

      interactionIndexes++;
    }

    return authorizationToken;
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
      headers = [],
      tokenRequest,
      credentialsRequired = true,
    } = options;

    let token: string = null;

    const isTokenCallBackFn = tokenRequest ? isFunction(tokenRequest) : null;

    if (isTokenCallBackFn) {
      try {
        token = tokenRequest(request, header);
      } catch (error) {
        return next(error);
      }
    }

    const hasTokenOrRequestHeaders = !token && Boolean(request.headers);

    if (hasTokenOrRequestHeaders) {
      const isAvaliableHeaders = Array.isArray(headers) && headers.length >= 1;

      const authorizationHeader = isAvaliableHeaders
        ? avaliableHeadersInRequest(request, headers)
        : request.get(header);

      if (authorizationHeader) {
        const authorizationSplitted = authorizationHeader.split(separator);

        const authorizationHeaderLength = authorizationSplitted.length !== 2;

        if (authorizationHeaderLength) {
          return next(
            new BadRequest('Token malformed, Authorization: Bearer [token]')
          );
        }

        const [bearer, authorizationToken] = authorizationSplitted;

        const isBearer = bearerTokenValidate.test(bearer);

        if (!isBearer) {
          return next(
            new Unauthorized('Token malformed, Authorization: Bearer [token]')
          );
        }

        token = authorizationToken;
      } else {
        if (credentialsRequired) {
          return next(new Unauthorized('No authorization token was found!'));
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

      const merged = {
        ...verifyOptions,
      };

      const decoded = await verifyAsync(token, secret, merged);

      const isCompleted = verifyOptions?.complete;

      const id = containsId ? getUserIdentifier(decoded, isCompleted) : null;

      /**
       * - merged properties
       */
      const properties = { id, decoded };

      user = properties;
    } catch (error) {
      const isTokenExpiredError = error instanceof TokenExpiredError;

      if (isTokenExpiredError) {
        const { expiredAt } = error;

        const expires = new Date(expiredAt).toLocaleString();

        const message = `Token expired at: ${expires}`;

        return next(httpError(401, message, { expiredAt }));
      }

      const isTokenNotBeforeError = error instanceof NotBeforeError;

      if (isTokenNotBeforeError) {
        const { date } = error;

        return next(httpError(401, 'Token not active!', { date }));
      }

      return next(new Unauthorized('Authorization token is invalid!'));
    }

    Object.assign(request, { user });
    return next();
  };
}
