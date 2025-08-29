import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import {
    register,
    verifyEmail,
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
    logout,
    getUserInfo
} from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post('/register', register);
authRouter.get('/verify-email/:token', verifyEmail);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/verify-otp', verifyOTP);
authRouter.post('/reset-password', resetPassword);
authRouter.get('/user-info', authorize, getUserInfo);

export default authRouter;