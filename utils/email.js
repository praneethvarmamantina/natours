const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = 'Boris Dietrich '
    
    //`Praneeth Varma<${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
   
   
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'boris.dietrich@ethereal.email',
          pass: 'ngDfpYuVN6MVeWQ7V8'
        }
  
      });
    
    }

      // Sendgrid
  
      return nodemailer.createTransport({

        service: 'SendGrid',

        auth: {

          user: process.env.SENDGRID_USERNAME,

          pass: process.env.SENDGRID_PASSWORD


        }

      });
   
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {

    await this.send('passwordReset', 'Your password reset token(valid only for 10 mins');

  }
};
