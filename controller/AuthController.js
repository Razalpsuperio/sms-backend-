// /controllers/authController.js
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import OtpVerification from '../models/OtpVerfication.js';


const transporter = nodemailer.createTransport({
    service: 'razalp0012300@gmail.com', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

// Sign Up
export const signUp = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Save OTP verification details
        const otpVerification = new OtpVerification({
            email,
            password: hashedPassword,
            otp,
            otpExpires,
        });

        await otpVerification.save();

        // Send OTP email
        await sendOtp(email, otp);

        res.status(201).json({ message: 'OTP sent, please verify' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Send OTP email
export const sendOtp = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpVerification = await OtpVerification.findOne({ email });

        if (!otpVerification) {
            return res.status(404).json({ message: 'OTP not found' });
        }

        if (otpVerification.otp !== otp || Date.now() > otpVerification.otpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = new User({
            email: otpVerification.email,
            password: otpVerification.password,
        });

        await user.save();

        await OtpVerification.deleteOne({ email });

        res.json({ 
            message: 'OTP verified, user registered',
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Sign In
export const signIn = async (req, res) => {
    const { email, password } = req.body;
    console.log('Received sign-in request for:', email);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found, comparing passwords');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Sign-in successful for:', email);
        res.json({
            message: 'Sign in successful',
            user: {
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Server error during sign-in:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = await bcrypt.hash(resetToken, 10); // Hash the reset token

        // Set the token and expiration in the user document
        user.passwordResetToken = resetTokenHash;
        user.passwordResetExpires = Date.now() + 3600000; // Token expires in 1 hour

        await user.save();

        // Create a reset URL to send via email
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

        // Send the email with the reset link
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Find the user with the matching token
        const user = await User.findOne({
            passwordResetToken: { $exists: true },
            passwordResetExpires: { $gt: Date.now() }, // Ensure token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Verify token
        const isValidToken = await bcrypt.compare(token, user.passwordResetToken);
        if (!isValidToken) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear reset token fields
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};