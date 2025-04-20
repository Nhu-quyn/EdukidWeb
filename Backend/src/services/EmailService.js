const nodemailer = require("nodemailer");
require("dotenv").config();
const sendEmail = async (newSend) => {
  try {
    const { to, subject, text } = newSend;
    console.log(newSend);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Thay bằng mật khẩu ứng dụng
      },
    });

    const mailOptions = {
      from: "edukidswordplay@gmail.com",
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
