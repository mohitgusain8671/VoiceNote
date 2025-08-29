import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET, ORIGIN } from "../config/env.js";
import mongoose from "mongoose";
import { sendVerificationEmail, sendOTPEmail } from "../utils/emailService.js";
import { generateOTP } from "../utils/otpGenerator.js";

// Register Controller
export const register = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !email || !password) {
            const error = new Error('First Name, Email, and Password are required');
            error.statusCode = 400;
            throw error;
        }
        if (password.length < 6) {
            const error = new Error('Password must be at least 6 characters long');
            error.statusCode = 400;
            throw error;
        }
        // Check user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                const error = new Error('User already exists and is verified');
                error.statusCode = 409;
                throw error;
            } else {
                // Delete existing unverified user and their tokens
                await Token.deleteMany({ userId: existingUser._id }, { session });
                await User.findByIdAndDelete(existingUser._id, { session });
            }
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const newUser = await User.create([{
            email,
            password: hashedPassword,
            firstName,
            lastName,
            isVerified: false
        }], { session });

        // Generate verification token
        const verificationToken = jwt.sign({ email, userId: newUser[0]._id }, JWT_SECRET, { expiresIn: '12h' });
        // Save token to db
        await Token.create([{
            token: verificationToken,
            userId: newUser[0]._id,
            type: 'email_verification',
            expiresAt: new Date(Date.now() + 43200000) // 12 hours
        }], { session });
        // Send token
        await sendVerificationEmail(email, verificationToken);
        await session.commitTransaction();
        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email for verification.',
            user: {
                id: newUser[0]._id,
                firstName: newUser[0].firstName,
                lastName: newUser[0].lastName,
                email: newUser[0].email,
                isVerified: newUser[0].isVerified
            }
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

// Verify Email Controller
export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is required'
            });
        }
        // Find token
        const tokenDoc = await Token.findOne({ 
            token, 
            type: 'email_verification',
            expiresAt: { $gt: new Date() }
        });
        if (!tokenDoc) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        // Update user verification status
        const user = await User.findByIdAndUpdate(
            tokenDoc.userId,
            { isVerified: true },
            { new: true }
        );
        // Delete
        await Token.findByIdAndDelete(tokenDoc._id);
        // Redirect to frontend
        res.redirect(`${ORIGIN}/login?verified=true`);
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }
        next(error);
    }
};

// Login Controller
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: 'Please verify your email before logging in'
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        const jwtToken = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        next(error);
    }
};

// Forgot Password Controller
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const otp = generateOTP();
        // Remove any existing forgot password tokens for this user
        await Token.deleteMany({ userId: user._id, type: 'forgot_password' });
        // Save OTP token
        await Token.create({
            token: otp,
            userId: user._id,
            type: 'forgot_password',
            expiresAt: new Date(Date.now() + 600000) // 10 minutes
        });
        await sendOTPEmail(email, otp);
        res.status(200).json({
            success: true,
            message: 'OTP sent to your email'
        });
    } catch (error) {
        next(error);
    }
};

// Verify OTP Controller
export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Find and verify OTP
        const tokenDoc = await Token.findOne({
            token: otp,
            userId: user._id,
            type: 'forgot_password',
            expiresAt: { $gt: new Date() }
        });
        if (!tokenDoc) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }
        tokenDoc.expiresAt = new Date(Date.now() + 600000); // Extend expiry time by 10 min
        await tokenDoc.save();
        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            resetToken: tokenDoc._id // send token ID for reset password
        });
    } catch (error) {
        next(error);
    }
};

// Reset Password Controller
export const resetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;
        if (!resetToken || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Reset token and new password are required'
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }
        // Find token
        const tokenDoc = await Token.findById(resetToken);
        if (!tokenDoc || tokenDoc.type !== 'forgot_password' || tokenDoc.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await User.findByIdAndUpdate(tokenDoc.userId, { password: hashedPassword });
        await Token.findByIdAndDelete(tokenDoc._id);
        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Logout Controller
export const logout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get User Info Controller
export const getUserInfo = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        next(error);
    }
};