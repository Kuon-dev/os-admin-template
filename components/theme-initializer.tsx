"use client";

import { useEffect } from 'react';
import { useSettingsStore } from '@/lib/store';

export function ThemeInitializer() {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    // Apply theme on mount and when it changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  return null;
}
