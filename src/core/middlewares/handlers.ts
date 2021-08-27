import { Request, Response, NextFunction } from 'express';

import { NotFound as HttpNotFound, HttpError, isHttpError } from 'http-errors';

/**
 * @function
 */
export function NotFound() {
  return (request: Request, response: Response, next: NextFunction) => {
    /**
     * - call next handler
     */
    return next(new HttpNotFound('Endpoint not found, are you lost?'));
  };
}

/**
 * @function
 */
export function HttpHandler() {
  return (error: HttpError, _: any, response: Response, next: NextFunction) => {
    const isHttpException = isHttpError(error);

    if (!isHttpException) {
      return response.status(500).json({ message: 'Internal server Error!' });
    }

    const { status, message, name } = error;

    /**
     * - merged error object
     */
    const merged = {
      error: {
        name,
        message,
        status,
        ...error,
      },
    };

    return response.status(status).json(merged);
  };
}
