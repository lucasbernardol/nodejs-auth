import { Context, ValidationErrorItem } from 'joi';
import { CelebrateError, isCelebrateError } from 'celebrate';

import { Response, NextFunction } from 'express';

export interface Options {
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
 * - A custom `celebrate` validation middleware `Joi`.
 */
export function celebrateValidation(options: Options = {}) {
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

  return (error: CelebrateError, _: any, res: Response, next: NextFunction) => {
    let exception = {};

    const isCelebrateException = isCelebrateError(error);

    if (!isCelebrateException) {
      /**
       * - next handler
       */
      return next(error);
    }

    for (let [prefix, celebrateError] of error.details.entries()) {
      const { name, message, details: celebrateDetails } = celebrateError;

      const details = setDetails
        ? validationNormalized(celebrateDetails)
        : null;

      const keys = celebrateError.details.map(({ path }) => path.join());

      exception[prefix] = { name, message, keys, details };
    }

    return res.status(status).json({ error: exception });
  };
}
