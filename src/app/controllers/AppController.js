import { User } from '../models/User.js';

export class AppController {
  /**
   * Render Home page
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @param {import('express').NextFunction} next
   * @returns
   */
  async home(request, response, next) {
    try {
      const totalCount = await User.countDocuments();

      console.log({ totalCount });

      return response.render('index', { data: { totalCount } });
    } catch (error) {
      return next(error);
    }
  }
}

export default new AppController();
