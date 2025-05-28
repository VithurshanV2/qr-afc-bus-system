import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, getUserById, updateVerifyOtp, verifyUserAccount } from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// User registration
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser({ name, email, password: hashedPassword });

        // Generate JWT token with user's ID
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set the JWT token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to SmartFare',
            text: `Hello ${name}, 
            Welcome to SmartFare, your digital companion for convenient and secure bus travel across Sri Lanka. 

            Your account has been successfully created using the email: ${email} 
            
            Thank you for joining us. We hope you enjoy a smoother and smarter commuting experience.
            
            Safe travels,
            The SmartFare Team`,

            html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Welcome to SmartFare</title>
                </head>
                <body style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    <p>Hello ${name},</p>
                    <p>Welcome to <strong>SmartFare</strong>, your digital companion for convenient and secure bus travel across Sri Lanka.</p>
                    <p>Your account has been successfully created using the email: <strong>${email}</strong></p>
                    <p>Thank you for joining us. We hope you enjoy a smoother and smarter commuting experience.</p>
                    <p>Safe travels,<br><strong>The SmartFare Team</strong></p>
                </body>
            </html>`
        }

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            success: true, message: 'User registered',
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// User login
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password fields required'
        });
    }

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Generate JWT token with user's ID
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set the JWT token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            success: true, message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// User logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.status(200).json({
            success: true, message: 'Logged Out'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// Send verification OTP to the user's email
export const sendVerifyOtp = async (req, res) => {
    try {
        const { id } = req.body;

        const user = await getUserById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: 'Account already verified' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day later

        await updateVerifyOtp(user.id, otp, expiry);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'SmartFare - Account Verification OTP',
            text: `Hello ${user.name}, 

            Your verification OTP is: ${otp} 
            
            Please use this OTP to verify your SmartFare account within the next 24 hours.

            If you did not request this email, please ignore it.
            
            Safe travels,
            The SmartFare Team`,
            html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>SmartFare - Account Verification OTP</title>
                </head>
                <body style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    <p>Hello ${user.name},</p>
                    <p>Your verification One-Time Password (OTP) is:</p>
                    <h2>${otp}</h2>
                    <p>Please use this OTP to verify your SmartFare account within the next 24 hours.</p>
                    <p>If you did not request this email, please ignore it.</p>
                    <p>Safe travels,<br><strong>The SmartFare Team</strong></p>
                </body>
            </html>`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'Verification OTP sent to email' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// Verify email
export const verifyEmail = async (req, res) => {
    const { id, otp } = req.body;

    if (!id || !otp) {
        return res.status(400).json({ success: false, message: 'Missing details' });
    }

    try {
        const user = await getUserById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(401).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < new Date()) {
            return res.status(403).json({ success: false, message: 'OTP expired' });
        }

        await verifyUserAccount(id);

        return res.status(200).json({ success: true, message: 'Email verified successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}