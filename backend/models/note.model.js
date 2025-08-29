import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  transcription: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    default: null,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Audio file information
  audioFile: {
    filePath: {
      type: String,
      default: null
    },
    originalName: {
      type: String,
      default: null
    },
    mimeType: {
      type: String,
      default: null
    },
    size: {
      type: Number,
      default: null
    },
    duration: {
      type: Number, // in seconds
      default: null
    }
  },
  filePath: {
    type: String,
    default: null
  }
},{
    timestamps: true,
    versionKey: false
});

// Index for better query performance
NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ userId: 1, updatedAt: -1 });

const Note = mongoose.model('Note', NoteSchema);
export default Note;