import { Context, ValidationErrorItem } from 'joi';
import { CelebrateError, isCelebrateError } from 'celebrate';

import { Request, Response, NextFunction } from 'express';

export interface CelebrateOptions {
  /**
   * @default 400
   */
  status?: number;
  /**
   * @default false
   */
  setDetails?: boolean;
}

export interface Details {
  key: string;
  message: string;
  context: Context;
}

/**
 * A custom `celebrate` validation middleware.
 * @function
 */
export function celebrateValidation(options: CelebrateOptions = {}) {
  const { status = 400, setDetails } = options;

  function validationNormalized(details: ValidationErrorItem[]): Details[] {
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
    _: Request,
    response: Response,
    next: NextFunction
  ) => {
    const isCelebrateException = isCelebrateError(error);

    if (!isCelebrateException) return next(error);

    const exception = {};

    for (let [key, celebrateError] of error.details.entries()) {
      const { name, message, details: celebrateDetails } = celebrateError;

      const details = setDetails
        ? validationNormalized(celebrateDetails)
        : null;

      const keys = celebrateError.details.map(({ path }) => {
        return path.join();
      });

      exception[key] = { name, message, keys, details };
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
