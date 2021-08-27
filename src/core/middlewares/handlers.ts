import { Context, ValidationErrorItem } from 'joi';
import { CelebrateError, isCelebrateError } from 'celebrate';

import { Request, Response, NextFunction } from 'express';
import { NotFound as HttpNotFound, HttpError, isHttpError } from 'http-errors';

export interface CelebrateOptions {
  /**
   * @default 400
   */
  status?: number;
  /**
   * @default false
   */
  hasDetails?: boolean;
}

export interface Details {
  key: string;
  message: string;
  context: Context;
}

/**
 * @function
 */
export function CelebrateValidation(options: CelebrateOptions = {}) {
  const { status = 400, hasDetails } = options;

  function detailsNormalized(details: ValidationErrorItem[]): Details[] {
    return details.map((detail) => ({
      key: detail.path.toString(),
      message: detail.message,
      context: {
        key: detail.context.key,
        label: detail.context.label,
        value: detail.context.value,
      },
    }));
  }

  return (
    error: CelebrateError,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const isCelebrateException = isCelebrateError(error);

    if (!isCelebrateException) return next(error);

    const exception = {};

    /**
     * - Map
     */
    for (let [key, celebrateError] of error.details.entries()) {
      const { name, message, details: celebrateDetails } = celebrateError;

      const details = hasDetails ? detailsNormalized(celebrateDetails) : null;

      const keys = celebrateError.details.map(({ path }) => path.join());

      exception[key] = {
        name,
        message,
        keys: keys,
        details,
      };
    }

    /**
     * - merged
     */
    const merged = {
      error: exception,
    };

    return response.status(status).json(merged);
  };
}

/**
 * @function
 */
export function NotFound() {
  return (request: Request, response: Response, next: NextFunction) => {
    return next(new HttpNotFound('Endpoint not found, are you lost?'));
  };
}

/**
 * @function
 */
export function HttpHandler() {
  return (
    error: HttpError,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const isHttpException = isHttpError(error);

    if (!isHttpException) {
      return response.status(500).json({ message: 'Internal server Error!' });
    }

    const { status, message, name } = error;

    /**
     * - merged
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
