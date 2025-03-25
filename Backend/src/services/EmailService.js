const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "edukidswordplay@gmail.com", // Thay bằng email của bạn
        pass: "12345678edukids", // Thay bằng mật khẩu ứng dụng
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
