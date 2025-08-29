import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.middleware.js";
import connectDB from "./database/mongodb.js";
import authRouter from "./routes/auth.routes.js";
import { PORT, ORIGIN } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Auth API is running!");
});

app.use(errorMiddleware);

const port = PORT || 8080;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectDB();
});