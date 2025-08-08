// Notification utilities (disabled in Expo Go / current build)
// These functions are no-ops to avoid Expo Go warnings for SDK 53.
export async function registerForPushNotificationsAsync() {
  return null
}

export async function scheduleNotification(_title, _body, _data = {}) {
  return
}

export async function scheduleDailyDigest() {
  return
}

export async function scheduleBreakingNews(_article) {
  return
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
