export class SessionController {
  async signIn(request, response, next) {
    try {
      return response.render('pages/sign-in', { error: {} });
    } catch (error) {
      return next(error);
    }
  }

  async signUp(request, response, next) {
    try {
      return response.render('pages/sign-up', { error: {} });
    } catch (error) {
      return next(error);
    }
  }
}

export default new SessionController();
