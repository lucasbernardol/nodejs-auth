import 'dotenv/config';

import nodemailer from 'nodemailer';

// Using mailtrap platform (development)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default async function sendMail({ email, resetPasswordUrl }) {
  return await transporter.sendMail({
    to: email,
    encoding: 'utf-8',
    from: 'Nodejs Auth <nodejs-auth@no-reply.com>',
    subject: 'Recuperação de senha - Nodejs auth',
    html: `
      <h1>Recuperação de senha - Nodejs Auth</h1>
      <p>
        Vocé solicitou a recuperação de conta através da nossa plataforma. 
        Continue usando as funcionalides  após criar uma nova senha. Click no 
        link abaixo e defina uma nova credencial de accesso.
      </p>

      <a 
        href="${resetPasswordUrl}" 
        title="Nova senha" 
        target="_blank"
        style="display: block;"
      >
        Criar nova senha
      <a/>
    `,
  });
}
