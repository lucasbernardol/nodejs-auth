import { Request, Response, NextFunction } from 'express';

/**
 * @function
 */
export function queryParams() {
  return (request: Request, response: Response, next: NextFunction) => {
    const isGetMethod = request.method.toUpperCase() === 'GET';

    /**
     * - merged `query params`
     */
    const params = isGetMethod
      ? ({
          ...request.query,
          page: Number(request.query.page) || 1,
          limit: Number(request.query.limit) || 10,
        } as any)
      : { ...request.query };

    request.query = params;

    return next();
  };
}
