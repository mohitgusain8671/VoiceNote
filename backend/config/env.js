import { config } from "dotenv";

config({ path: `.env` });
export const { 
    PORT, 
    NODE_ENV, 
    DB_URI, 
    JWT_SECRET, 
    ORIGIN, 
    SERVER_URL,
    EMAIL_USER,
    EMAIL_PASS,
    GEMINI_API_KEY 
} = process.env;