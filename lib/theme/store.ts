'use client';

import { create } from 'zustand';

export type Theme = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'soulprofile.theme';

function readStored(): Theme {
  if (typeof localStorage === 'undefined') return 'auto';
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' || v === 'auto' ? v : 'auto';
}

function systemPref(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function effective(theme: Theme): 'light' | 'dark' {
  return theme === 'auto' ? systemPref() : theme;
}

type State = {
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (t: Theme) => void;
};

export const useThemeStore = create<State>((set) => ({
  theme: 'auto',
  resolved: 'dark',
  setTheme: (theme) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, theme);
    const resolved = effective(theme);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
    }
    set({ theme, resolved });
  },
}));

/** İlk yüklemede çağrılır */
export function initTheme() {
  const stored = readStored();
  const resolved = effective(stored);
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }
  useThemeStore.setState({ theme: stored, resolved });

  // System tema değişikliği auto modda canlı yansır
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', () => {
      const s = useThemeStore.getState();
      if (s.theme === 'auto') {
        const newResolved = systemPref();
        document.documentElement.dataset.theme = newResolved;
        document.documentElement.style.colorScheme = newResolved;
        useThemeStore.setState({ resolved: newResolved });
      }
    });
  }
}
