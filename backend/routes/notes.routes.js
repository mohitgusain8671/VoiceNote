import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { uploadRecording } from "../middleware/upload.middleware.js";
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  generateSummary,
  deleteNote,
  getNotesStats,
  transcribeAudio,
} from "../controller/notes.controller.js";

const notesRouter = Router();

// All routes require authentication
notesRouter.use(authorize);

// GET /api/notes - Get all notes for the authenticated user
notesRouter.get("/", getAllNotes);

// GET /api/notes/stats - Get notes statistics for the authenticated user
notesRouter.get("/stats", getNotesStats);

// GET /api/notes/:id - Get a specific note by ID
notesRouter.get("/:id", getNoteById);

// POST /api/notes/transcribe - Transcribe audio recording
notesRouter.post("/transcribe", uploadRecording, transcribeAudio);

// POST /api/notes - Create a new note with transcription and audio path
notesRouter.post("/", createNote);

// PUT /api/notes/:id - Update a note (title and/or transcription only)
notesRouter.put("/:id", updateNote);

// POST /api/notes/:id/summary - Generate AI summary for a note
notesRouter.post("/:id/summary", generateSummary);

// DELETE /api/notes/:id - Delete a note
notesRouter.delete("/:id", deleteNote);

export default notesRouter;
