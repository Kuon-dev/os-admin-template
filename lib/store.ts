import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type Locale = 'en' | 'cn';

interface SettingsState {
  theme: Theme;
  locale: Locale;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  toggleEmailNotifications: () => void;
  togglePushNotifications: () => void;
  toggleSmsNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      locale: 'en',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
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
      },
      setLocale: (locale) => {
        set({ locale });
        // Set cookie for locale
        document.cookie = `locale=${locale};path=/;max-age=31536000`;
      },
      toggleEmailNotifications: () =>
        set((state) => ({ emailNotifications: !state.emailNotifications })),
      togglePushNotifications: () =>
        set((state) => ({ pushNotifications: !state.pushNotifications })),
      toggleSmsNotifications: () =>
        set((state) => ({ smsNotifications: !state.smsNotifications })),
    }),
    {
      name: 'admin-settings',
    }
  )
);
