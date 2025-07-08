const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: process.env.SENDER_EMAIL, 
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    console.log("Email sent to", to);
  } catch (error) {
    console.error("Email failed", error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = sendEmail;
