import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import errorMiddleware from "./middleware/error.middleware.js";
import connectDB from "./database/mongodb.js";
import authRouter from "./routes/auth.routes.js";
import notesRouter from "./routes/notes.routes.js";
import { PORT, ORIGIN } from "./config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = ORIGIN ? ORIGIN.split(',') : ['http://localhost:5173'];
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // Increased limit for longer transcriptions

// Serve static audio files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);

app.get("/", (req, res) => {
  res.send("VoiceNote API is running!");
});

app.use(errorMiddleware);

const port = PORT || 8080;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Audio files served at: http://localhost:${port}/uploads/audio/`);
  await connectDB();
});