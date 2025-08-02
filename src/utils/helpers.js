// Notification utilities
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export async function registerForPushNotificationsAsync() {
  let token

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data
  } else {
    alert('Must use physical device for Push Notifications')
  }

  return token
}

export async function scheduleNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: { seconds: 2 },
  })
}

export async function scheduleDailyDigest() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your Daily News Digest',
      body: "Check out today's top stories and breaking news",
      data: { type: 'daily_digest' },
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    },
  })
}

export async function scheduleBreakingNews(article) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🚨 Breaking News',
      body: article.title,
      data: {
        type: 'breaking_news',
        articleId: article.id,
      },
    },
    trigger: { seconds: 1 },
  })
}

// Date utilities
export function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Today'
  if (diffDays === 2) return 'Yesterday'
  if (diffDays <= 7) return `${diffDays - 1} days ago`
  return date.toLocaleDateString()
}

export function formatDateLong(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now - date

  const minutes = Math.floor(diffTime / (1000 * 60))
  const hours = Math.floor(diffTime / (1000 * 60 * 60))
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else {
    return `${days}d ago`
  }
}

// Number utilities
export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return String(num)
}

// Text utilities
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

// Storage utilities
export function generateUniqueId() {
  return String(Date.now()) + String(Math.random()).substr(2)
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Network utilities
export function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// Theme utilities
export function getContrastColor(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

// Content utilities
export function estimateReadingTime(text) {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

export function extractFirstParagraph(text) {
  const paragraphs = text.split('\n\n')
  return paragraphs[0] || text.substring(0, 200) + '...'
}

// Search utilities
export function highlightSearchText(text, query) {
  if (!query) return text

  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

export function fuzzySearch(items, query, key) {
  if (!query) return items

  const queryLower = query.toLowerCase()

  return items.filter((item) => {
    const text = typeof item === 'string' ? item : item[key]
    return text.toLowerCase().includes(queryLower)
  })
}
