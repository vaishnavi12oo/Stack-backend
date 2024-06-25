// controllers/otpController.js

import nodemailer from 'nodemailer';
import Otp from '../models/Otp.js';

export const sendOtp = async (req, res) => {
    const { email } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000);

    // Create transporter for sending emails
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL, // Replace with your email
            pass: process.env.PASSWORD // Replace with your email password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otpCode}`
    };

    try {
        await transporter.sendMail(mailOptions);

        // Save OTP to the database
        const otp = new Otp({ email, otp: otpCode });
        await otp.save();

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Optionally delete the OTP record after verification
        await Otp.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
};
