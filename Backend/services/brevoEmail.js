const sgMail = require('@getbrevo/brevo');

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey, 
  process.env.BREVO_API_KEY
);

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.htmlContent = html;
    
    sendSmtpEmail.sender = { "email": process.env.SENDER_EMAIL };
    
    sendSmtpEmail.to = [{ "email": to }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent to", to);

  } catch (error) {
    console.error("Email failed", error);
    if (error.response && error.response.body) {
      console.error(JSON.stringify(error.response.body, null, 2));
    }
  }
};

module.exports = sendEmail;
