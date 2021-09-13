import { Request, Response, NextFunction } from 'express';

export type Links = {
  github: string;
};

export type Api = {
  version: string;
  links: Links;
  author?: string;
  paths: {
    users: string;
    address: string;
    sessions: {
      label: string;
      methods: string[];
    };
  };
};

/**
 * @class MainController
 */
export class MainController {
  public main(request: Request, response: Response, next: NextFunction) {
    try {
      /**
       * - API metadata
       */
      const api: Api = {
        version: '1.0.0',
        links: {
          github: 'https://github.com/lucasbernardol/nodejs-auth',
        },
        author: 'lucasbernardol',
        paths: {
          users: '/users',
          address: '/address',
          sessions: {
            label: '/sessions',
            methods: ['POST'],
          },
        },
      };

      return response.status(200).json({ api });
    } catch (error) {
      return next(error);
    }
  }
}
