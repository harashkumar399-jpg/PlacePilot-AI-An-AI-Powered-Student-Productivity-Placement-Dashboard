const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "harashkumar399@gmail.com",   // ✅ tera gmail
    pass: "uylyikotvfyryhsw",           // ✅ WITHOUT SPACES
  },
});

  const mailOptions = {
    from: '"PlacePilot AI" <harashkumar399@gmail.com>',
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;