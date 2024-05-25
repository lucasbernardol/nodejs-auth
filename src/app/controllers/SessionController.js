export class SessionController {
  async signIn(request, response, next) {
    try {
      return response.render('pages/sign-in', { error: {} });
    } catch (error) {
      return next(error);
    }
  }
}

export default new SessionController();
