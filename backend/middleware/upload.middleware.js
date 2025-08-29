import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadsDir = "uploads/audio";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage for any audio recordings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Preserve original extension or use default
    const userId = req.userId;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || ".webm";
    const filename = `${userId}_${timestamp}${ext}`;
    cb(null, filename);
  },
});

// Configure multer for any audio recordings
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for recordings
  },
});

// Middleware for audio recording upload
export const uploadRecording = upload.single("audioRecording");
