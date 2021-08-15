import { Request, Response, NextFunction } from 'express';

class MainController {
  /**
   * @public
   */
  public main(request: Request, response: Response, next: NextFunction) {
    try {
      return response.json({ api: { version: '1.0.0' } });
    } catch (error) {
      return next(error);
    }
  }
}

export { MainController };
