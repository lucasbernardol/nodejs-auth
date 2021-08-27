import { Request, Response, NextFunction } from 'express';

import { NotFound, HttpError, isHttpError } from 'http-errors';

/**
 * @function
 */
function NotFoundHandler() {
  return (request: Request, response: Response, next: NextFunction) => {
    return next(new NotFound('Endpoint not found, are you lost?'));
  };
}

function HttpHandler() {
  return (error: HttpError, _: any, response: Response, next: NextFunction) => {
    const isHttpException = isHttpError(error);

    if (isHttpException) {
      const { status, message, name } = error;

      /**
       * - merged error object
       */
      const merged = {
        name,
        message,
        status,
        ...error,
      };

      return response.status(status).json({ error: merged });
    }

    return response.status(500).json({
      message: 'Internal server Error!',
    });
  };
}

export { NotFoundHandler as NotFound, HttpHandler };
