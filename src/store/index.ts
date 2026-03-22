import { create } from 'zustand';
import { Locale, User } from '@/types';

interface AppState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  locale: 'ar',
  setLocale: (locale) => set({ locale }),
  user: null,
  setUser: (user) => set({ user }),
  isMenuOpen: false,
  setMenuOpen: (open) => set({ isMenuOpen: open }),
}));
