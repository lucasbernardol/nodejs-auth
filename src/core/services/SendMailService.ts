import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import { resolve } from 'path';
import fs from 'fs';

import config from '../../config/nodemailer';

export interface SentMailOptions {
  to: string;
  subject: string;
  variables: object | any;
  template: string;
}

class MailService {
  /**
   * - nodemailer, transporter
   */
  private client: Transporter;

  public constructor() {
    this.client = nodemailer.createTransport(config.transporter);
  }

  async sendMessage(options: SentMailOptions) {
    const { to, subject, variables, template } = options;

    const paths = resolve(__dirname, '..', 'views', 'mail', `${template}.hbs`);

    const templateFile = fs.readFileSync(paths, { encoding: 'utf-8' });

    const handlebarsTemplate = handlebars.compile(templateFile);

    const sentMessageInfo = await this.client.sendMail({
      from: config.from,
      to,
      subject,
      html: handlebarsTemplate(variables),
    });

    return { sentMessageInfo };
  }
}

export { MailService };
