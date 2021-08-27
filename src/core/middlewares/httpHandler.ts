import { NextFunction, Response, Request } from 'express';

import { isHttpError, HttpError } from 'http-errors';

export function httpHandler() {
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

    return response.status(500).json({ message: 'Internal server Error' });
  };
}
