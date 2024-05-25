import { User } from '../models/User.js';

export class DashboardController {
  /**
   * Dashboard handlers
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @param {import('express').NextFunction} next
   * @returns
   */
  async profile(request, response, next) {
    try {
      const userId = request.userId;

      const user = await User.findById(userId);

      return response.render('pages/dashboard', { user });
    } catch (error) {
      return next(error);
    }
  }
}

export default new DashboardController();
