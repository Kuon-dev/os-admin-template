/**
 * Domain Settings Types
 * Defines the structure for CMS domain configuration
 */

export interface DomainConfig {
  primaryDomain: string
  customDomains: string[]
}

export interface SeoDefaults {
  titlePattern: string
  metaDescription: string
  ogImage: string
  favicon: string
}

export interface UrlStructure {
  slugPattern: string
  trailingSlash: boolean
  redirects: RedirectRule[]
}

export interface RedirectRule {
  from: string
  to: string
}

export interface AnalyticsConfig {
  gaId: string
  gtmId: string
  customScripts: string
}

export interface DomainSettings {
  domain: DomainConfig
  seo: SeoDefaults
  url: UrlStructure
  analytics: AnalyticsConfig
}

/**
 * Zustand Store Interface
 */
export interface DomainSettingsStore {
  settings: DomainSettings
  isLoading: boolean
  isSaving: boolean

  // Actions
  updateDomainConfig: (config: Partial<DomainConfig>) => void
  updateSeoDefaults: (seo: Partial<SeoDefaults>) => void
  updateUrlStructure: (url: Partial<UrlStructure>) => void
  updateAnalytics: (analytics: Partial<AnalyticsConfig>) => void
  saveSettings: () => Promise<void>
  loadSettings: () => void
  resetSettings: () => void
}

/**
 * Default initial settings
 */
export const defaultDomainSettings: DomainSettings = {
  domain: {
    primaryDomain: '',
    customDomains: [],
  },
  seo: {
    titlePattern: '{page_title} | My Site',
    metaDescription: '',
    ogImage: '',
    favicon: '/favicon.ico',
  },
  url: {
    slugPattern: '/{slug}',
    trailingSlash: false,
    redirects: [],
  },
  analytics: {
    gaId: '',
    gtmId: '',
    customScripts: '',
  },
}
