import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

const authorize = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // Check if token exists
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized, no token provided" 
            });
        }
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        // Check if user exists and is verified
        const user = await User.findById(decoded.userId);
        if (!user || !user.isVerified) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized, user not found or not verified" 
            });
        }
        req.userId = decoded.userId;
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized, invalid or expired token" 
            });
        }
        return res.status(401).json({ 
            success: false,
            message: "Unauthorized", 
            error: error.message 
        });
    }
};

export default authorize;