// App configuration
export const APP_CONFIG = {
  name: 'The Pakistan Tribune',
  version: '1.0.0',
  description: 'Stay informed, stay connected',

  // API Configuration (for future use)
  api: {
    baseUrl: 'https://tribune-server.vercel.app/api',
    timeout: 10000,
    retries: 3,
    // Default cache TTL for API responses (ms)
    cacheTtlMs: 5 * 60 * 1000,
  },

  // Feature flags
  features: {
    pushNotifications: true,
    offlineReading: true,
    socialSharing: true,
    darkMode: true,
    analytics: true,
    location: true,
    audio: false, // Future feature
    comments: false, // Future feature
  },

  // Content configuration
  content: {
    articlesPerPage: 20,
    maxBookmarks: 500,
    maxOfflineArticles: 100,
    maxSearchHistory: 20,
    defaultCategory: 'top',
    supportedLanguages: ['en'],
    // If true, tapping a story will open the original source URL in the browser (when available)
    openExternalOnTap: true,
  },

  // Notification configuration
  notifications: {
    categories: {
      breaking: {
        id: 'breaking_news',
        name: 'Breaking News',
        description: 'Important breaking news alerts',
        importance: 'max',
      },
      daily: {
        id: 'daily_digest',
        name: 'Daily Digest',
        description: 'Daily news summary',
        importance: 'default',
      },
      followed: {
        id: 'followed_content',
        name: 'Followed Topics',
        description: 'Updates from followed topics and authors',
        importance: 'default',
      },
      recommendations: {
        id: 'recommendations',
        name: 'Recommendations',
        description: 'Personalized article recommendations',
        importance: 'low',
      },
    },
    schedule: {
      dailyDigest: {
        hour: 8,
        minute: 0,
      },
    },
  },

  // Theme configuration
  theme: {
    fonts: {
      small: 12,
      medium: 16,
      large: 20,
      xlarge: 24,
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      small: 4,
      medium: 8,
      large: 12,
      xlarge: 16,
    },
    animation: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
  },

  // Social media links
  social: {
    website: 'https://pakistantribune.example.com',
    twitter: 'https://twitter.com/PakTribuneApp',
    facebook: 'https://facebook.com/PakTribuneApp',
    instagram: 'https://instagram.com/PakTribuneApp',
    email: 'support@pakistantribune.example.com',
  },

  // Legal links
  legal: {
    privacy: 'https://pakistantribune.example.com/privacy',
    terms: 'https://pakistantribune.example.com/terms',
    cookies: 'https://pakistantribune.example.com/cookies',
  },

  // Analytics events
  analytics: {
    events: {
      articleRead: 'article_read',
      articleShared: 'article_shared',
      articleBookmarked: 'article_bookmarked',
      categoryViewed: 'category_viewed',
      searchPerformed: 'search_performed',
      topicFollowed: 'topic_followed',
      authorFollowed: 'author_followed',
      notificationOpened: 'notification_opened',
      offlineArticleSaved: 'offline_article_saved',
    },
  },

  // Error messages
  errors: {
    network: 'Network connection error. Please check your internet connection.',
    generic: 'Something went wrong. Please try again.',
    notFound: 'Content not found.',
    offline: 'You are offline. Showing cached content.',
  },

  // Success messages
  success: {
    bookmarkAdded: 'Article bookmarked successfully',
    bookmarkRemoved: 'Bookmark removed',
    readLaterAdded: 'Added to read later',
    readLaterRemoved: 'Removed from read later',
    offlineSaved: 'Article saved for offline reading',
    topicFollowed: 'Topic followed',
    topicUnfollowed: 'Topic unfollowed',
    authorFollowed: 'Author followed',
    authorUnfollowed: 'Author unfollowed',
  },
}

// Category configuration
export const CATEGORIES = {
  top: {
    name: 'Top Stories',
    icon: 'star',
    color: '#fbbf24',
    description: 'The most important stories from around the world',
  },
  technology: {
    name: 'Technology',
    icon: 'laptop',
    color: '#3b82f6',
    description: 'Latest developments in tech, AI, and innovation',
  },
  business: {
    name: 'Business',
    icon: 'briefcase',
    color: '#10b981',
    description: 'Market trends, finance, and corporate news',
  },
  sports: {
    name: 'Sports',
    icon: 'football',
    color: '#f59e0b',
    description: 'Sports news, scores, and athlete stories',
  },
  politics: {
    name: 'Politics',
    icon: 'library',
    color: '#6366f1',
    description: 'Political developments and government news',
  },
  health: {
    name: 'Health',
    icon: 'medical',
    color: '#ef4444',
    description: 'Medical breakthroughs and health advice',
  },
  science: {
    name: 'Science',
    icon: 'flask',
    color: '#8b5cf6',
    description: 'Scientific discoveries and research',
  },
  entertainment: {
    name: 'Entertainment',
    icon: 'musical-notes',
    color: '#ec4899',
    description: 'Celebrity news, movies, music, and culture',
  },
}

// Default user preferences
export const DEFAULT_PREFERENCES = {
  notifications: {
    breaking: true,
    daily: true,
    followed: true,
    recommendations: false,
  },
  reading: {
    fontSize: 16,
    autoDownload: false,
    offlineLimit: 50,
  },
  privacy: {
    analytics: true,
    location: false,
    personalizedAds: false,
  },
  appearance: {
    theme: 'auto', // 'light', 'dark', 'auto'
  },
}

// Storage keys
export const STORAGE_KEYS = {
  theme: 'app_theme',
  user: 'user_data',
  bookmarks: 'bookmarks',
  readLater: 'read_later',
  followedTopics: 'followed_topics',
  followedAuthors: 'followed_authors',
  readArticles: 'read_articles',
  offlineArticles: 'offline_articles',
  preferences: 'user_preferences',
  searchHistory: 'search_history',
  onboardingCompleted: 'onboarding_completed',
  // Namespaced cache keys for API responses
  cache: {
    top: 'cache.top.v1',
    categoryPrefix: 'cache.category.v1.',
    searchPrefix: 'cache.search.v1.',
  },
}
