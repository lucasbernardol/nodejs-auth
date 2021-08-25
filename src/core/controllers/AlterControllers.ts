import { NextFunction, Request, Response } from 'express';

import { MailService } from '../services/SendMailService';
import { AlterServices } from '../services/AlterServices';

/**
 * @class
 */
class AlterControllers {
  async change(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.user;

      const { oldPassword, password } = request.body;

      const services = new AlterServices();

      const { updated } = await services.change({ id, oldPassword, password });

      return response.json({ id, updated });
    } catch (error) {
      return next(error);
    }
  }

  async forgot(request: Request, response: Response, next: NextFunction) {
    try {
      const { email } = request.body;

      const services = new AlterServices();

      const { updated, token } = await services.forgot(email);

      const mail = new MailService();

      /**
       * - nodemailer options
       */
      const options = {
        to: email,
        subject: 'Esqueceu sua senha?',
        variables: { token },
        template: 'forgot',
      };

      await mail.sendMessage(options);

      return response.json({ updated });
    } catch (error) {
      return next(error);
    }
  }
}

export { AlterControllers };
