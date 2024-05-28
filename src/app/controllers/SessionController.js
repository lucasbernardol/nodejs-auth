export class SessionController {
  static ERROR_STATE = {};

  async signIn(request, response, next) {
    try {
      return response.render('pages/sign-in', {
        error: SessionController.ERROR_STATE,
      });
    } catch (error) {
      return next(error);
    }
  }

  async signUp(request, response, next) {
    try {
      return response.render('pages/sign-up', {
        error: SessionController.ERROR_STATE,
      });
    } catch (error) {
      return next(error);
    }
  }

  async recovery(request, response, next) {
    // forgot password
    try {
      return response.render('pages/forgot-password', {
        error: SessionController.ERROR_STATE,
      });
    } catch (error) {
      return next(error);
    }
  }

  async reset(request, response, next) {
    // forgot password
    try {
      return response.render('pages/reset-password', {
        error: SessionController.ERROR_STATE,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default new SessionController();
