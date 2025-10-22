import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  DomainSettings,
  DomainSettingsStore,
  DomainConfig,
  SeoDefaults,
  UrlStructure,
  AnalyticsConfig,
  defaultDomainSettings,
} from '@/types/domain-settings';

// LocalStorage key
const STORAGE_KEY = 'cms-domain-settings';

// Helper functions for localStorage
const loadFromStorage = (): DomainSettings | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn(`Error loading ${STORAGE_KEY} from localStorage:`, error);
    return null;
  }
};

const saveToStorage = (settings: DomainSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn(`Error saving ${STORAGE_KEY} to localStorage:`, error);
  }
};

// Initialize with default settings or load from localStorage
const getInitialSettings = (): DomainSettings => {
  const stored = loadFromStorage();
  if (stored) return stored;

  // Default mock data for demonstration
  return {
    domain: {
      primaryDomain: 'mysite.com',
      customDomains: ['blog.mysite.com', 'docs.mysite.com'],
    },
    seo: {
      titlePattern: '{page_title} | My Awesome Site',
      metaDescription: 'Welcome to my awesome website. Discover amazing content and features.',
      ogImage: 'https://mysite.com/og-default.jpg',
      favicon: '/favicon.ico',
    },
    url: {
      slugPattern: '/{slug}',
      trailingSlash: false,
      redirects: [
        { from: '/old-about', to: '/about' },
        { from: '/blog/post-1', to: '/articles/first-post' },
      ],
    },
    analytics: {
      gaId: 'G-XXXXXXXXXX',
      gtmId: 'GTM-XXXXXXX',
      customScripts: '<!-- Custom tracking script -->\n<script>\n  console.log("Analytics initialized");\n</script>',
    },
  };
};

export const useDomainSettingsStore = create<DomainSettingsStore>()(
  devtools(
    (set, get) => ({
      settings: getInitialSettings(),
      isLoading: false,
      isSaving: false,

      updateDomainConfig: (config: Partial<DomainConfig>) => {
        set((state) => {
          const newSettings = {
            ...state.settings,
            domain: {
              ...state.settings.domain,
              ...config,
            },
          };
          return { settings: newSettings };
        }, false, 'updateDomainConfig');
      },

      updateSeoDefaults: (seo: Partial<SeoDefaults>) => {
        set((state) => {
          const newSettings = {
            ...state.settings,
            seo: {
              ...state.settings.seo,
              ...seo,
            },
          };
          return { settings: newSettings };
        }, false, 'updateSeoDefaults');
      },

      updateUrlStructure: (url: Partial<UrlStructure>) => {
        set((state) => {
          const newSettings = {
            ...state.settings,
            url: {
              ...state.settings.url,
              ...url,
            },
          };
          return { settings: newSettings };
        }, false, 'updateUrlStructure');
      },

      updateAnalytics: (analytics: Partial<AnalyticsConfig>) => {
        set((state) => {
          const newSettings = {
            ...state.settings,
            analytics: {
              ...state.settings.analytics,
              ...analytics,
            },
          };
          return { settings: newSettings };
        }, false, 'updateAnalytics');
      },

      saveSettings: async () => {
        const { settings } = get();
        set({ isSaving: true }, false, 'saveSettings:start');

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Save to localStorage (mock persistence)
        saveToStorage(settings);

        set({ isSaving: false }, false, 'saveSettings:complete');
      },

      loadSettings: () => {
        set({ isLoading: true }, false, 'loadSettings:start');

        const stored = loadFromStorage();
        if (stored) {
          set({ settings: stored, isLoading: false }, false, 'loadSettings:complete');
        } else {
          set({ isLoading: false }, false, 'loadSettings:noData');
        }
      },

      resetSettings: () => {
        const defaultSettings = getInitialSettings();
        set({ settings: defaultSettings }, false, 'resetSettings');
        saveToStorage(defaultSettings);
      },
    }),
    { name: 'DomainSettingsStore' }
  )
);
