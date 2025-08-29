import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";
import { createNotesSlice } from "./slices/notes-slice";

export const useAppStore = create()((...a) => ({
  ...createAuthSlice(...a),
  ...createNotesSlice(...a),
}));