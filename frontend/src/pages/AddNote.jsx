import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppStore } from '../store';
import Navbar from '../components/Navbar';
import ActionButton from '../components/ActionButton';

const AddNote = () => {
  const navigate = useNavigate();
  const { transcribeAudio, createNote, loading } = useAppStore();
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showTranscribe, setShowTranscribe] = useState(false);
  const [transcriptionData, setTranscriptionData] = useState(null);
  const [title, setTitle] = useState('');
  const [transcription, setTranscription] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setShowTranscribe(true);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  // Reset recording
  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setShowTranscribe(false);
    setTranscriptionData(null);
    setTitle('');
    setTranscription('');
    setRecordingTime(0);
    setIsPlaying(false);
  };

  // Play/pause audio
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Transcribe audio
  const handleTranscribeAudio = async () => {
    if (!audioBlob) return;

    try {
      const result = await transcribeAudio(audioBlob);
      setTranscriptionData(result);
      setTranscription(result.transcription);
      setTitle('Voice Note ' + new Date().toLocaleDateString());
      toast.success('Audio transcribed successfully!');
    } catch (error) {
      toast.error('Failed to transcribe audio');
    }
  };

  // Save note
  const saveNote = async () => {
    if (!title.trim() || !transcription.trim()) {
      toast.error('Please provide both title and transcription');
      return;
    }

    try {
      await createNote({
        title: title.trim(),
        transcription: transcription.trim(),
        audioFilePath: transcriptionData?.audioFilePath
      });
      toast.success('Note saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Record Voice Note</h1>
            <p className="text-gray-600">Record your thoughts and get instant transcription</p>
          </div>

          {/* Recording Section */}
          {!transcriptionData && (
            <div className="text-center mb-8">
              {!isRecording && !audioBlob && (
                <div>
                  <button
                    onClick={startRecording}
                    className="w-32 h-32 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Mic className="w-12 h-12" />
                  </button>
                  <p className="text-gray-600">Click to start recording</p>
                </div>
              )}

              {isRecording && (
                <div>
                  <button
                    onClick={stopRecording}
                    className="w-32 h-32 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-200 transform hover:scale-105 shadow-lg animate-pulse"
                  >
                    <Square className="w-12 h-12" />
                  </button>
                  <p className="text-red-600 font-semibold">Recording... {formatTime(recordingTime)}</p>
                  <div className="flex justify-center mt-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}

              {audioBlob && showTranscribe && (
                <div>
                  <div className="flex justify-center items-center space-x-4 mb-6">
                    <button
                      onClick={togglePlayback}
                      className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </button>
                    <button
                      onClick={resetRecording}
                      className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <RotateCcw className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                  
                  <button
                    onClick={handleTranscribeAudio}
                    disabled={loading.transcribing}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
                  >
                    {loading.transcribing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Transcribing Audio...</span>
                      </div>
                    ) : (
                      'Transcribe Audio into Text'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Transcription Form */}
          {transcriptionData && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Transcription Complete
                </div>
              </div>

              {/* Audio Player */}
              {transcriptionData.audioUrl && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recorded Audio
                  </label>
                  <audio controls className="w-full">
                    <source src={transcriptionData.audioUrl} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
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

              {/* Transcription Textarea */}
              <div>
                <label htmlFor="transcription" className="block text-sm font-medium text-gray-700 mb-2">
                  Transcription (Editable)
                </label>
                <textarea
                  id="transcription"
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Edit your transcription here..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <ActionButton
                  onClick={saveNote}
                  variant="success"
                  size="md"
                  disabled={loading.saving}
                  loading={loading.saving}
                  className="flex-1"
                >
                  Save Note
                </ActionButton>
                
                <ActionButton
                  onClick={() => navigate('/dashboard')}
                  variant="secondary"
                  size="md"
                  className="flex-1"
                >
                  Cancel
                </ActionButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNote;