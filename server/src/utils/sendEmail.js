"use strict";
const nodemailer = require("nodemailer");
const { google } = require('googleapis');

const MAILING_SERVICE = process.env.SMPT_SERVICE;
const CLIENT_ID = process.env.SMTP_CLIENT_ID;
const CLIENT_SECRET = process.env.SMTP_CLIENT_SECRET;
const REDIRECT_URI = process.env.SMTP_REDIRECT_URI;
const REFRECE_TOKEN = process.env.SMTP_REFRECE_TOKEN;
const MAILING_EMAIL = process.env.SMPT_EMAIL;
const OAUTH2_CLIENT = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

OAUTH2_CLIENT.setCredentials({
  refresh_token: REFRECE_TOKEN,
});

const sendEmail = async (options) => {
  const ACCESS_TOKEN = await new Promise((resolve, reject) => {
    OAUTH2_CLIENT.getAccessToken((err, token) => {
      if (err) console.log(err); // Handling the errors
      else resolve(token);
    });
  });
  let transporter = nodemailer.createTransport({
    host: "https://mail.google.com/",
    service: MAILING_SERVICE,
    port: 465,
    secure: true, // true for 465, false for other ports
    authMethod: "",
    auth: {
      type: "OAuth2",
      user: MAILING_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRECE_TOKEN,
      accessToken: ACCESS_TOKEN,
      expires: 1484314697598,
    },
  });

  const mailOptions = {
    from: MAILING_EMAIL,
    auth: {
      user: MAILING_EMAIL,
    },
    ...options
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
