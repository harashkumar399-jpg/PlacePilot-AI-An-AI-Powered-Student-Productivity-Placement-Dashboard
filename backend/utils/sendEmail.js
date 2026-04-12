const nodemailer = require("nodemailer");

//  SEND EMAIL FUNCTION 
const sendEmail = async (email, otp) => {
  try {
    // 1. transporter create (gmail + env credentials)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // .env se aayega
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // 2. mail content define
    const mailOptions = {
      from: `"PlacePilot AI" <${process.env.EMAIL_USER}>`, // dynamic sender
      to: email, // receiver email
      subject: "OTP Verification",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    // 3. send mail
    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Email not sent");
  }
};

module.exports = sendEmail;