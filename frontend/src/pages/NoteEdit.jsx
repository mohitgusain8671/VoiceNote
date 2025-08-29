import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Volume2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAppStore } from "../store";
import { apiClient } from "../lib/api-client";
import Navbar from "../components/Navbar";

const NoteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, loading, fetchNoteById, updateNote, clearCurrentNote } =
    useAppStore();

  const [title, setTitle] = useState("");
  const [transcription, setTranscription] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalTranscription, setOriginalTranscription] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchNoteById(id).catch(() => {
      toast.error("Note not found");
      navigate("/dashboard");
    });

    return () => {
      clearCurrentNote();
    };
  }, [id, fetchNoteById, clearCurrentNote, navigate]);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setTranscription(currentNote.transcription);
      setOriginalTitle(currentNote.title);
      setOriginalTranscription(currentNote.transcription);
    }
  }, [currentNote]);

  useEffect(() => {
    // Check if there are changes
    const titleChanged = title !== originalTitle;
    const transcriptionChanged = transcription !== originalTranscription;
    setHasChanges(titleChanged || transcriptionChanged);
  }, [title, transcription, originalTitle, originalTranscription]);

  const handleSave = async () => {
    if (!title.trim() || !transcription.trim()) {
      toast.error("Please provide both title and transcription");
      return;
    }

    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    try {
      await updateNote(id, {
        title: title.trim(),
        transcription: transcription.trim(),
      });
      toast.success("Note updated successfully");
      navigate(`/notes/${id}`);
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to cancel?"
        )
      ) {
        navigate(`/notes/${id}`);
      }
    } else {
      navigate(`/notes/${id}`);
    }
  };

  const resetChanges = () => {
    setTitle(originalTitle);
    setTranscription(originalTranscription);
  };

  if (loading.currentNote) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading note...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600">Note not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Note</span>
            </button>

            <div className="flex items-center space-x-2">
              {hasChanges && (
                <button
                  onClick={resetChanges}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Reset Changes
                </button>
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Edit Note
              </h1>
              {hasChanges && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    You have unsaved changes
                  </p>
                </div>
              )}
            </div>

            {/* Audio Player (Read-only) */}
            {currentNote.audioFile?.url && (
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-3">
                  <Volume2 className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Audio Recording
                  </h3>
                </div>
                <audio controls className="w-full">
                  <source
                    src={currentNote.audioFile.url}
                    type={currentNote.audioFile.mimeType || "audio/webm"}
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Note Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter note title..."
              />
            </div>
            <div>
              <label
                htmlFor="transcription"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Transcription
              </label>
              <textarea
                id="transcription"
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Edit your transcription here..."
              />
            </div>

            {/* AI summary*/}
            {currentNote.summary && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Summary (Read-only)
                </label>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <p className="text-gray-700 leading-relaxed">
                    {currentNote.summary}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Note: Summary will be cleared if you modify the transcription.
                  You can regenerate it after saving.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={loading.saving || !hasChanges}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
              >
                {loading.saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEdit;
