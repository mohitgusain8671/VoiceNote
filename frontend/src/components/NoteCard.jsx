import React from 'react';
import { Edit, Trash2, Sparkles, Eye, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppStore } from '../store';

const NoteCard = ({ note, onDeleteNote, onRefresh }) => {
  const navigate = useNavigate();
  const { generateSummary, loading } = useAppStore();

  const handleViewNote = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  const handleEditNote = (noteId) => {
    navigate(`/notes/${noteId}/edit`);
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await onDeleteNote(noteId);
        toast.success('Note deleted successfully');
      } catch (err) {
        toast.error('Failed to delete note');
      }
    }
  };

  const handleGenerateSummary = async (noteId) => {
    try {
      await generateSummary(noteId);
      toast.success('AI summary generated successfully');
    } catch (err) {
      toast.error('Failed to generate summary');
    }
  };

  const truncateContent = (content, maxLines = 4) => {
    const words = content.split(' ');
    const wordsPerLine = 10; // Approximate words per line
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return content;
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 md:p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] flex flex-col h-full">
      {/* Note Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate pr-2 flex-1">
          {note.title}
        </h3>
        <div className="flex space-x-1 flex-shrink-0">
          <button
            onClick={() => handleViewNote(note._id)}
            className="p-1.5 md:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Note"
          >
            <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button
            onClick={() => handleEditNote(note._id)}
            className="p-1.5 md:p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit Note"
          >
            <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button
            onClick={() => handleDeleteNote(note._id)}
            className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Note"
          >
            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Audio Indicator */}
      {note.audioFile?.url && (
        <div className="flex items-center mb-2">
          <Volume2 className="w-4 h-4 text-blue-500 mr-1" />
          <span className="text-xs text-blue-600">Has audio recording</span>
        </div>
      )}

      {/* Note Content */}
      <div className="flex-1 mb-4">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
          {truncateContent(note.transcription, 4)}
        </p>
      </div>

      {/* Note Footer */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
        <span className="text-xs text-gray-500 order-2 sm:order-1">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
        
        {/* Summary Button */}
        {note.summary ? (
          <button
            onClick={() => handleViewNote(note._id)}
            className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs font-medium rounded-lg transition-all duration-200 transform hover:scale-105 order-1 sm:order-2"
            title='View AI Summary'
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">View Summary</span>
            <span className="sm:hidden">Summary</span>
          </button>
        ) : (
          <button
            onClick={() => handleGenerateSummary(note._id)}
            disabled={loading.generatingSummary}
            className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white text-xs font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none order-1 sm:order-2"
            title='Generate AI Summary'
          >
            <Sparkles className={`w-3 h-3 ${loading.generatingSummary ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {loading.generatingSummary ? 'Generating...' : 'Generate Summary'}
            </span>
            <span className="sm:hidden">
              {loading.generatingSummary ? 'Gen...' : 'Summary'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCard;