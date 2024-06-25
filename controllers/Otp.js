import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';

const otps = {}; // In-memory storage for OTPs, replace with a database in production

// Generate and send OTP
export const sendOtp = (req, res) => {
  const { email } = req.body;
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

  // Store OTP in memory (for demonstration purposes)
  otps[email] = otp;

  // Send OTP to user's email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending OTP');
    }
    res.status(200).send('OTP sent successfully');
  });
};

// Verify OTP
export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (otps[email] === otp) {
    delete otps[email]; // Remove OTP after successful verification
    res.status(200).send({ message: 'OTP verified successfully' });
  } else {
    res.status(400).send({ message: 'Invalid OTP' });
  }
};
