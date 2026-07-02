const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((err) => {

    if (err) {

        console.log(err);

    } else {

        console.log("SMTP Connected");

    }

});

const sendMail = async (to, subject, html) => {

    return transporter.sendMail({

        from: `"${process.env.SMTP_FROM}" <${process.env.SMTP_MAIL}>`,

        to,

        subject,

        html,

    });

};

module.exports = sendMail;