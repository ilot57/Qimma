import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types for our store state
export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
}

export interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;

  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';

  // Application state
  credits: number;
  currentExam: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCredits: (credits: number) => void;
  setCurrentExam: (examId: string | null) => void;
  resetState: () => void;
}

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  sidebarOpen: true,
  theme: 'system' as const,
  credits: 0,
  currentExam: null,
};

// Create the main store
export const useStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // User actions
        setUser: (user) => set({ user }, false, 'setUser'),
        setAuthenticated: (authenticated) =>
          set({ isAuthenticated: authenticated }, false, 'setAuthenticated'),

        // UI actions
        setSidebarOpen: (open) =>
          set({ sidebarOpen: open }, false, 'setSidebarOpen'),
        toggleSidebar: () =>
          set(
            (state) => ({ sidebarOpen: !state.sidebarOpen }),
            false,
            'toggleSidebar'
          ),
        setTheme: (theme) => set({ theme }, false, 'setTheme'),

        // Application actions
        setCredits: (credits) => set({ credits }, false, 'setCredits'),
        setCurrentExam: (examId) =>
          set({ currentExam: examId }, false, 'setCurrentExam'),

        // Reset all state
        resetState: () => set(initialState, false, 'resetState'),
      }),
      {
        name: 'qimma-store', // Unique name for localStorage key
        partialize: (state) => ({
          // Only persist certain parts of the state
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          credits: state.credits,
        }),
      }
    ),
    {
      name: 'QimmaStore', // Name for devtools
    }
  )
);

// Selectors for common use cases
export const useUser = () => useStore((state) => state.user);
export const useIsAuthenticated = () =>
  useStore((state) => state.isAuthenticated);
export const useCredits = () => useStore((state) => state.credits);
export const useSidebarOpen = () => useStore((state) => state.sidebarOpen);
export const useTheme = () => useStore((state) => state.theme);
