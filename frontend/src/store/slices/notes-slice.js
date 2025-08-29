import { apiClient } from "../../lib/api-client";
import { NOTES_ROUTES } from "../../utils/constants";

export const createNotesSlice = (set, get) => ({
  // Notes state
  notes: [],
  currentNote: null,
  stats: {
    totalNotes: 0,
    notesWithSummary: 0,
    notesWithoutSummary: 0,
  },
  loading: {
    notes: false,
    stats: false,
    currentNote: false,
    transcribing: false,
    saving: false,
    deleting: false,
    generatingSummary: false,
  },
  error: null,

  // Actions
  setLoading: (key, value) =>
    set((state) => ({
      loading: { ...state.loading, [key]: value },
    })),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Fetch all notes
  fetchNotes: async () => {
    try {
      get().setLoading("notes", true);
      get().clearError();

      const response = await apiClient.get(NOTES_ROUTES.GET_ALL_NOTES);

      if (response.data.success) {
        set({ notes: response.data.data.notes });
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      get().setError("Failed to fetch notes");
    } finally {
      get().setLoading("notes", false);
    }
  },

  // Fetch notes statistics
  fetchStats: async () => {
    try {
      get().setLoading("stats", true);
      get().clearError();

      const response = await apiClient.get(NOTES_ROUTES.GET_NOTES_STATS);

      if (response.data.success) {
        set({ stats: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      get().setError("Failed to fetch statistics");
    } finally {
      get().setLoading("stats", false);
    }
  },

  // Fetch dashboard data (notes + stats)
  fetchDashboardData: async () => {
    try {
      get().setLoading("notes", true);
      get().setLoading("stats", true);
      get().clearError();

      const [notesResponse, statsResponse] = await Promise.all([
        apiClient.get(NOTES_ROUTES.GET_ALL_NOTES),
        apiClient.get(NOTES_ROUTES.GET_NOTES_STATS),
      ]);

      if (notesResponse.data.success) {
        set({ notes: notesResponse.data.data.notes });
      }

      if (statsResponse.data.success) {
        set({ stats: statsResponse.data.data });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      get().setError("Failed to fetch dashboard data");
    } finally {
      get().setLoading("notes", false);
      get().setLoading("stats", false);
    }
  },

  // Fetch single note by ID
  fetchNoteById: async (id) => {
    try {
      get().setLoading("currentNote", true);
      get().clearError();

      const response = await apiClient.get(NOTES_ROUTES.GET_NOTE_BY_ID(id));

      if (response.data.success) {
        set({ currentNote: response.data.data });
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching note:", error);
      get().setError("Failed to fetch note");
      throw error;
    } finally {
      get().setLoading("currentNote", false);
    }
  },

  // Transcribe audio
  transcribeAudio: async (audioBlob) => {
    try {
      get().setLoading("transcribing", true);
      get().clearError();

      const formData = new FormData();
      formData.append("audioRecording", audioBlob);

      const response = await apiClient.post(
        NOTES_ROUTES.TRANSCRIBE_AUDIO,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      get().setError("Failed to transcribe audio");
      throw error;
    } finally {
      get().setLoading("transcribing", false);
    }
  },

  // Create new note
  createNote: async (noteData) => {
    try {
      get().setLoading("saving", true);
      get().clearError();

      const response = await apiClient.post(NOTES_ROUTES.CREATE_NOTE, noteData);

      if (response.data.success) {
        // Add new note to the beginning of the list
        set((state) => ({
          notes: [response.data.data, ...state.notes],
        }));

        // Update stats
        get().fetchStats();

        return response.data.data;
      }
    } catch (error) {
      console.error("Error creating note:", error);
      get().setError("Failed to create note");
      throw error;
    } finally {
      get().setLoading("saving", false);
    }
  },

  // Update note
  updateNote: async (id, updateData) => {
    try {
      get().setLoading("saving", true);
      get().clearError();

      const response = await apiClient.put(
        NOTES_ROUTES.UPDATE_NOTE(id),
        updateData
      );

      if (response.data.success) {
        const updatedNote = response.data.data;

        // Update note in the list
        set((state) => ({
          notes: state.notes.map((note) =>
            note._id === id ? updatedNote : note
          ),
          currentNote:
            state.currentNote?._id === id ? updatedNote : state.currentNote,
        }));

        return updatedNote;
      }
    } catch (error) {
      console.error("Error updating note:", error);
      get().setError("Failed to update note");
      throw error;
    } finally {
      get().setLoading("saving", false);
    }
  },

  // Delete note
  deleteNote: async (id) => {
    try {
      get().setLoading("deleting", true);
      get().clearError();

      const response = await apiClient.delete(NOTES_ROUTES.DELETE_NOTE(id));

      if (response.data.success) {
        // Remove note from the list
        set((state) => ({
          notes: state.notes.filter((note) => note._id !== id),
          currentNote: state.currentNote?._id === id ? null : state.currentNote,
        }));

        // Update stats
        get().fetchStats();

        return true;
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      get().setError("Failed to delete note");
      throw error;
    } finally {
      get().setLoading("deleting", false);
    }
  },

  // Generate summary
  generateSummary: async (id) => {
    try {
      get().setLoading("generatingSummary", true);
      get().clearError();

      const response = await apiClient.post(NOTES_ROUTES.GENERATE_SUMMARY(id));

      if (response.data.success) {
        const summary = response.data.data.summary;

        // Update note with summary
        set((state) => ({
          notes: state.notes.map((note) =>
            note._id === id ? { ...note, summary } : note
          ),
          currentNote:
            state.currentNote?._id === id
              ? { ...state.currentNote, summary }
              : state.currentNote,
        }));

        // Update stats
        get().fetchStats();

        return summary;
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      get().setError("Failed to generate summary");
      throw error;
    } finally {
      get().setLoading("generatingSummary", false);
    }
  },

  // Clear current note
  clearCurrentNote: () => set({ currentNote: null }),

  // Reset notes state
  resetNotesState: () =>
    set({
      notes: [],
      currentNote: null,
      stats: {
        totalNotes: 0,
        notesWithSummary: 0,
        notesWithoutSummary: 0,
      },
      loading: {
        notes: false,
        stats: false,
        currentNote: false,
        transcribing: false,
        saving: false,
        deleting: false,
        generatingSummary: false,
      },
      error: null,
    }),
});
