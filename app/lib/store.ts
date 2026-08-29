'use client';

import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

/**
 * ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================
 */

// Auth Types
interface User {
  id: string;
  email: string;
  userType: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  loginStart: () => void;
  loginSuccess: (user: User, token: string) => void;
  loginFailure: (error: string) => void;
  logout: () => void;
}

// Lawyer Types
interface Lawyer {
  id: string;
  bio: string;
  hourlyRate: number;
  specializations: string[];
  averageRating: number;
}

interface LawyersState {
  lawyers: Lawyer[];
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchLawyersStart: () => void;
  fetchLawyersSuccess: (lawyers: Lawyer[]) => void;
  fetchLawyersFailure: (error: string) => void;
  setLawyers: (lawyers: Lawyer[]) => void;
}

// Consultation Types
interface Consultation {
  id: string;
  lawyerId: string;
  title: string;
  scheduledDate: string;
  status: string;
}

interface ConsultationState {
  consultations: Consultation[];
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchConsultationsStart: () => void;
  fetchConsultationsSuccess: (consultations: Consultation[]) => void;
  fetchConsultationsFailure: (error: string) => void;
  addConsultation: (consultation: Consultation) => void;
}

// UI Types
interface UIState {
  darkMode: boolean;
  language: string;
  sidebarOpen: boolean;
  // Actions
  toggleDarkMode: () => void;
  setLanguage: (language: string) => void;
  toggleSidebar: () => void;
}

/**
 * ============================================================================
 * AUTH STORE - handles user authentication, login/logout
 * ============================================================================
 */
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      loginStart: () => set({ isLoading: true, error: null }),

      loginSuccess: (user: User, token: string) =>
        set({
          user,
          token,
          isLoading: false,
          error: null,
        }),

      loginFailure: (error: string) =>
        set({
          error,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

/**
 * ============================================================================
 * LAWYERS STORE - manages lawyer list and metadata
 * ============================================================================
 */
export const useLawyers = create<LawyersState>()(
  subscribeWithSelector((set) => ({
    lawyers: [],
    isLoading: false,
    error: null,

    fetchLawyersStart: () => set({ isLoading: true, error: null }),

    fetchLawyersSuccess: (lawyers: Lawyer[]) =>
      set({
        lawyers,
        isLoading: false,
        error: null,
      }),

    fetchLawyersFailure: (error: string) =>
      set({
        error,
        isLoading: false,
      }),

    setLawyers: (lawyers: Lawyer[]) =>
      set({
        lawyers,
        error: null,
      }),
  }))
);

/**
 * ============================================================================
 * CONSULTATIONS STORE - manages user consultations
 * ============================================================================
 */
export const useConsultations = create<ConsultationState>()(
  subscribeWithSelector((set) => ({
    consultations: [],
    isLoading: false,
    error: null,

    fetchConsultationsStart: () => set({ isLoading: true, error: null }),

    fetchConsultationsSuccess: (consultations: Consultation[]) =>
      set({
        consultations,
        isLoading: false,
        error: null,
      }),

    fetchConsultationsFailure: (error: string) =>
      set({
        error,
        isLoading: false,
      }),

    addConsultation: (consultation: Consultation) =>
      set((state) => ({
        consultations: [...state.consultations, consultation],
      })),
  }))
);

/**
 * ============================================================================
 * UI STORE - manages application UI state (theme, language, sidebar)
 * ============================================================================
 */
export const useUI = create<UIState>()(
  persist(
    (set) => ({
      darkMode: false,
      language: 'en',
      sidebarOpen: true,

      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),

      setLanguage: (language: string) => set({ language }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),
    }),
    {
      name: 'ui-store',
    }
  )
);

/**
 * ============================================================================
 * EXPORT ALL HOOKS - backwards compatibility aliases
 * ============================================================================
 * These exports maintain the original store names for easier migration
 */
export const useAuthStore = useAuth;
export const useLawyersStore = useLawyers;
export const useConsultationStore = useConsultations;
export const useUIStore = useUI;
