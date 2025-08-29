import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Sparkles, ArrowLeft, Volume2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppStore } from '../store';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ActionButton from '../components/ActionButton';

const NoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentNote, 
    loading, 
    fetchNoteById, 
    generateSummary, 
    deleteNote,
    clearCurrentNote 
  } = useAppStore();

  useEffect(() => {
    fetchNoteById(id).catch(() => {
      toast.error('Note not found');
      navigate('/dashboard');
    });

    return () => {
      clearCurrentNote();
    };
  }, [id, fetchNoteById, clearCurrentNote, navigate]);

  const handleGenerateSummary = async () => {
    try {
      await generateSummary(id);
      toast.success('AI summary generated successfully');
    } catch (error) {
      toast.error('Failed to generate summary');
    }
  };

  const handleEdit = () => {
    navigate(`/notes/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        await deleteNote(id);
        toast.success('Note deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  if (loading.currentNote) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        <LoadingSpinner 
          size="lg" 
          text="Loading note..." 
          className="mt-20"
        />
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
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Note"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={loading.deleting}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete Note"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Note Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentNote.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Created: {new Date(currentNote.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(currentNote.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {currentNote.audioFile?.url && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center mb-3">
                <Volume2 className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Audio Recording</h3>
              </div>
              <audio controls className="w-full">
                <source src={currentNote.audioFile.url} type={currentNote.audioFile.mimeType || 'audio/webm'} />
                browser does not support this audio element.
              </audio>
            </div>
          )}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transcription</h3>
            <div className="p-6 bg-gray-50 rounded-xl">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {currentNote.transcription}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">AI Summary</h3>
              {!currentNote.summary && (
                <button
                  onClick={handleGenerateSummary}
                  disabled={loading.generatingSummary}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  <Sparkles className={`w-4 h-4 ${loading.generatingSummary ? 'animate-spin' : ''}`} />
                  <span>{loading.generatingSummary ? 'Generating...' : 'Generate Summary'}</span>
                </button>
              )}
            </div>
            
            {currentNote.summary ? (
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <p className="text-gray-700 leading-relaxed">
                  {currentNote.summary}
                </p>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-center">
                  No AI summary generated yet. Click the button above to generate one.
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <ActionButton
              onClick={handleEdit}
              variant="primary"
              size="md"
              className="flex-1"
              icon={Edit}
            >
              Edit Note
            </ActionButton>
            <ActionButton
              onClick={handleDelete}
              variant="danger"
              size="md"
              disabled={loading.deleting}
              loading={loading.deleting}
              className="flex-1"
              icon={Trash2}
            >
              Delete Note
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteView;