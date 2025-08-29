export const HOST = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

// Auth API Routes
export const AUTH_ROUTES = {
  REGISTER: "/api/auth/register",
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  VERIFY_EMAIL: "/api/auth/verify-email",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  VERIFY_OTP: "/api/auth/verify-otp",
  RESET_PASSWORD: "/api/auth/reset-password",
  USER_INFO: "/api/auth/user-info",
};
