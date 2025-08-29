import Note from "../models/Note.model.js";
import geminiService from "../services/geminiService.js";
import fileManager from "../utils/fileManager.js";
import { SERVER_URL } from "../config/env.js";
import mongoose from "mongoose";

// Get all notes for a user
export const getAllNotes = async (req, res, next) => {
  try {
    const userId = req.userId;
    const notes = await Note.find({ userId })
      .sort({ updatedAt: -1 });
    
    const notesWithUrls = notes.map(note => {
      const noteObj = note.toObject();
      if (noteObj.audioFile?.filePath) {
        noteObj.audioFile.url = fileManager.getFileUrl(noteObj.audioFile.filePath, SERVER_URL);
      }
      return noteObj;
    });
    res.status(200).json({
      success: true,
      data: {
        notes: notesWithUrls,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }
    const note = await Note.findOne({ _id: id, userId }).select("-__v");
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }
    const noteObj = note.toObject();
    if (noteObj.audioFile?.filePath) {
      noteObj.audioFile.url = fileManager.getFileUrl(noteObj.audioFile.filePath, SERVER_URL);
    }

    res.status(200).json({
      success: true,
      data: noteObj,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new note with audio file path
export const createNote = async (req, res, next) => {
  try {
    const { title, transcription, audioFilePath } = req.body;
    const userId = req.userId;
    if (!title || !transcription) {
      return res.status(400).json({
        success: false,
        message: "Title and transcription are required",
      });
    }
    if (title.trim().length === 0 || transcription.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and transcription cannot be empty",
      });
    }
    const noteData = {
      title: title.trim(),
      transcription: transcription.trim(),
      userId,
      isNew: true,
    };
    if (audioFilePath) {
      noteData.audioFile = {
        filePath: audioFilePath,
        originalName: "recording.webm",
        mimeType: "audio/webm",
        size: 0,
      };
      noteData.filePath = audioFilePath;
    }
    const newNote = await Note.create(noteData);
    const noteObj = newNote.toObject();
    if (noteObj.audioFile?.filePath) {
      noteObj.audioFile.url = fileManager.getFileUrl(noteObj.audioFile.filePath, SERVER_URL);
    }

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: noteObj,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, transcription } = req.body;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }
    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }
    const updateData = {};
    if (title !== undefined) {
      if (title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }
      updateData.title = title.trim();
    }
    if (transcription !== undefined) {
      if (transcription.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Transcription cannot be empty",
        });
      }
      updateData.transcription = transcription.trim();
      // Clear summary if transcription is updated
      updateData.summary = null;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }
    const updatedNote = await Note.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

export const generateSummary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }
    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }
    if (note.summary) {
      return res.status(200).json({
        success: true,
        message: "Summary already exists",
        data: {
          summary: note.summary,
          isNew: false,
        },
      });
    }
    const summary = await geminiService.generateSummary(note.transcription);
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { summary },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Summary generated successfully",
      data: {
        summary: updatedNote.summary,
        note: updatedNote,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }
    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }
    await Note.findByIdAndDelete(id);
    if (note.audioFile?.filePath) {
      fileManager.deleteAudioFile(note.audioFile.filePath);
    }
    if (note.filePath) {
      fileManager.deleteAudioFile(note.filePath);
    }
    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: {
        deletedNoteId: id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAudioFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const audioFile = req.file;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }

    if (!audioFile) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required",
      });
    }
    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      fileManager.deleteAudioFile(audioFile.path);
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.audioFile?.filePath) {
      fileManager.deleteAudioFile(note.audioFile.filePath);
    }
    if (note.filePath) {
      fileManager.deleteAudioFile(note.filePath);
    }

    const updateData = {
      audioFile: {
        filePath: audioFile.path,
        originalName: audioFile.originalname,
        mimeType: audioFile.mimetype,
        size: audioFile.size,
      },
      filePath: audioFile.path,
    };

    const updatedNote = await Note.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    const noteObj = updatedNote.toObject();
    if (noteObj.audioFile?.filePath) {
      noteObj.audioFile.url = fileManager.getFileUrl(noteObj.audioFile.filePath, SERVER_URL);
    }
    res.status(200).json({
      success: true,
      message: "Audio file updated successfully",
      data: noteObj,
    });
  } catch (error) {
    if (req.file) {
      fileManager.deleteAudioFile(req.file.path);
    }
    next(error);
  }
};

export const transcribeAudio = async (req, res, next) => {
  try {
    const userId = req.userId;
    const audioFile = req.file;
    if (!audioFile) {
      return res.status(400).json({
        success: false,
        message: "Audio recording is required",
      });
    }

    const transcriptionResult = await geminiService.transcribeAudio(audioFile.path);
    if (!transcriptionResult.success) {
      fileManager.deleteAudioFile(audioFile.path);
      return res.status(500).json({
        success: false,
        message: transcriptionResult.error || "Failed to transcribe audio",
      });
    }
    res.status(200).json({
      success: true,
      message: "Audio transcribed successfully",
      data: {
        transcription: transcriptionResult.transcription,
        audioFilePath: audioFile.path,
        audioUrl: fileManager.getFileUrl(audioFile.path, SERVER_URL),
        confidence: transcriptionResult.confidence,
        duration: transcriptionResult.duration,
      },
    });
  } catch (error) {
    if (req.file) {
      fileManager.deleteAudioFile(req.file.path);
    }
    next(error);
  }
};

export const getNotesStats = async (req, res, next) => {
  try {
    const userId = req.userId;
    const stats = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          notesWithSummary: {
            $sum: {
              $cond: [{ $ne: ["$summary", null] }, 1, 0],
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalNotes: 0,
      notesWithSummary: 0,
    };
    res.status(200).json({
      success: true,
      data: {
        totalNotes: result.totalNotes,
        notesWithSummary: result.notesWithSummary,
        notesWithoutSummary: result.totalNotes - result.notesWithSummary,
      },
    });
  } catch (error) {
    next(error);
  }
};
