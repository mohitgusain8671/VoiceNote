import React from 'react';
import { Plus, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NoteCard from './NoteCard';

const NotesList = ({ notes, onDeleteNote, onRefresh }) => {
  const navigate = useNavigate();

  const handleAddNote = () => {
    navigate('/add-note');
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Notes</h1>
          <p className="text-gray-600 mt-1">Organize your thoughts and ideas</p>
        </div>
        <button
          onClick={handleAddNote}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Record New Note</span>
        </button>
      </div>

      {/* Notes list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
        {notes.map((note) => (
          <NoteCard 
            key={note._id} 
            note={note} 
            onDeleteNote={onDeleteNote}
            onRefresh={onRefresh}
          />
        ))}
      </div>

      {/* No Notes */}
      {notes.length === 0 && (
        <div className="text-center py-16 col-span-full">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mic className="w-10 h-10 md:w-12 md:h-12 text-indigo-500" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No notes yet</h3>
          <p className="text-gray-600 mb-6">Start creating your first voice note</p>
          <button
            onClick={handleAddNote}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Record First Note</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NotesList;