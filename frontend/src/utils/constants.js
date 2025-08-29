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

// Notes API Routes
export const NOTES_ROUTES = {
  GET_ALL_NOTES: "/api/notes",
  GET_NOTES_STATS: "/api/notes/stats",
  GET_NOTE_BY_ID: (id) => `/api/notes/${id}`,
  CREATE_NOTE: "/api/notes",
  UPDATE_NOTE: (id) => `/api/notes/${id}`,
  DELETE_NOTE: (id) => `/api/notes/${id}`,
  TRANSCRIBE_AUDIO: "/api/notes/transcribe",
  GENERATE_SUMMARY: (id) => `/api/notes/${id}/summary`,
};
