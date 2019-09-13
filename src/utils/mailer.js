const senderEmail = process.env.EMAIL;

const sendEmail = (transport, emailData) => new Promise((resolve, reject) => {
  transport.sendMail({
    from: `"Magma Talent Team"<${senderEmail}>`, // sender address
    to: `${emailData.recipientEmail}`,
    subject: `${emailData.subject}`, // Subject line
    html: `${emailData.body}`
  }, (err, info) => (err ? reject(err) : resolve(info)));
});

export default sendEmail;
