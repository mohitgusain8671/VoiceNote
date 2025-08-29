import React, { useEffect } from 'react';
import NotesList from '../components/NotesList';
import Navbar from '../components/Navbar';
import StatsGrid from '../components/StatsGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ActionButton from '../components/ActionButton';
import { useAppStore } from '../store';

const Dashboard = () => {
  const { 
    userInfo, 
    notes, 
    stats, 
    loading, 
    error,
    fetchDashboardData,
    deleteNote 
  } = useAppStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  if (loading.notes || loading.stats) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        <LoadingSpinner 
          size="lg" 
          text="Loading your dashboard..." 
          className="mt-20"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userInfo?.name || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your voice notes and transcriptions
          </p>
        </div>

        {/* Stats Grid */}
        <StatsGrid 
          stats={stats} 
          loading={loading.stats} 
        />

        {/* Quick Actions */}
        <div className="mb-8">
          <ActionButton
            to="/add-note"
            variant="primary"
            size="md"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          >
            Record New Note
          </ActionButton>
        </div>

        {/* Notes List */}
        {error ? (
          <ErrorMessage 
            message={error} 
            onRetry={fetchDashboardData}
            className="mb-8"
          />
        ) : (
          <NotesList 
            notes={notes} 
            onDeleteNote={handleDeleteNote}
            onRefresh={fetchDashboardData}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
