const sendEmail = (transport, emailData) => new Promise((resolve, reject) => {
  transport.sendMail(emailData, (err, info) => (err ? reject(err) : resolve(info)));
});

export default sendEmail;
