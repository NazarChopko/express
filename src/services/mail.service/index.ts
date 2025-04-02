import nodemailer from "nodemailer";

import handlebars from "nodemailer-express-handlebars";
import path from "path";
import ApiError from "../../exception";
import config from "config";
import { Config } from "../../types/config";

const appConfig: Config = config.get("app");

class MailService {
  transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // @ts-ignore
      host: "smtp.gmail.com",
      port: appConfig.smtpPort,
      secure: false,
      auth: { user: appConfig.smtpUser, pass: appConfig.smtpPassword },
    });

    this.transporter.use(
      "compile",
      handlebars({
        viewEngine: {
          extname: ".hbs",
          partialsDir: path.resolve("views"),
          defaultLayout: false,
        },
        viewPath: path.resolve("views"),
        extName: ".hbs",
      }),
    );
  }

  async sendMail(to: string, subject: string, template: string, context: object) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      template,
      context,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.log(error);
      throw ApiError.internal("Email sending error");
    }
  }
}

export default new MailService();
