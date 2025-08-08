import Constants from 'expo-constants'

let BackgroundTask = null
let TaskManager = null
let Network = null
let taskDefined = false

const TASK_NAME = 'offline-refresh-task'
const MAX_OFFLINE = 40

function loadModules() {
  if (!BackgroundTask) BackgroundTask = require('expo-background-task')
  if (!TaskManager) TaskManager = require('expo-task-manager')
  if (!Network) Network = require('expo-network')
}

// Core prefetch implementation (shared by task and manual trigger)
async function fetchAndStoreOfflineArticles() {
  // Lazy-load to avoid overhead in Expo Go and unneeded contexts
  const AsyncStorage = require('@react-native-async-storage/async-storage').default
  const sanitizeArticle = require('./sanitizeArticle').default
  const { newsArticles } = require('../data/newsData')

  // Read preferences and followed topics
  let prefs = { autoDownload: false, dataSync: true, analytics: true, wifiOnly: false }
  try {
    const raw = await AsyncStorage.getItem('settings.preferences')
    if (raw) prefs = { ...prefs, ...JSON.parse(raw) }
  } catch {}

  // Network conditions (Wi‑Fi only)
  try {
    if (prefs.wifiOnly) {
      loadModules()
      const state = await Network.getNetworkStateAsync()
      const isWifi = state?.type === Network.NetworkStateType.WIFI || state?.type === 'WIFI'
      const isConnected = !!state?.isConnected
      if (!isConnected || !isWifi) {
        // Skipping prefetch: Wi‑Fi only is enabled and not on Wi‑Fi
        return { skipped: true, reason: 'wifiOnly' }
      }
    }
  } catch (e) {
    // If network check fails, proceed (don’t block)
  }

  // Determine candidate articles: top + followed topics
  let followedTopics = []
  try {
    const rawTopics = await AsyncStorage.getItem('followedTopics')
    if (rawTopics) followedTopics = JSON.parse(rawTopics)
  } catch {}

  const followedSlugs = new Set((followedTopics || []).map((t) => t?.slug).filter(Boolean))

  // Sort by publishDate desc if present
  const sorted = [...newsArticles].sort((a, b) => {
    const ad = Date.parse(a.publishDate || '') || 0
    const bd = Date.parse(b.publishDate || '') || 0
    return bd - ad
  })

  const top = sorted.slice(0, 25)
  const byFollowed = sorted.filter((a) => followedSlugs.has(a.category)).slice(0, 25)
  const selected = [...top, ...byFollowed]

  // Load existing offline
  let existing = []
  try {
    const raw = await AsyncStorage.getItem('offlineArticles')
    if (raw) existing = JSON.parse(raw)
  } catch {}

  // Merge, sanitize, dedupe by id, cap to MAX_OFFLINE
  const map = new Map()
  const put = (arr) => {
    for (const a of arr) {
      if (!a) continue
      const clean = sanitizeArticle(a)
      if (!clean?.id) continue
      if (!map.has(clean.id)) map.set(clean.id, clean)
    }
  }
  put(existing)
  put(selected)
  // Convert to array and sort again by publishDate desc
  const merged = Array.from(map.values()).sort((a, b) => {
    const ad = Date.parse(a.publishDate || '') || 0
    const bd = Date.parse(b.publishDate || '') || 0
    return bd - ad
  })
  const capped = merged.slice(0, MAX_OFFLINE)

  try {
    await AsyncStorage.setItem('offlineArticles', JSON.stringify(capped))
    await AsyncStorage.setItem('offline.lastRefreshed', new Date().toISOString())
  } catch (e) {
    // Failed to persist offline articles
    throw e
  }
  return { skipped: false, stored: capped.length }
}

function ensureTaskDefined() {
  if (taskDefined) return
  loadModules()
  TaskManager.defineTask(TASK_NAME, async () => {
    try {
      await fetchAndStoreOfflineArticles()
      return BackgroundTask.BackgroundTaskResult.Success
    } catch (e) {
      return BackgroundTask.BackgroundTaskResult.Failed
    }
  })
  taskDefined = true
}

export async function registerBackgroundFetchAsync() {
  try {
    // Skip in Expo Go; background fetch APIs are not available there
    if (Constants?.appOwnership === 'expo') {
      // Skipping background registration in Expo Go
      return false
    }
    ensureTaskDefined()
    const status = await BackgroundTask.getStatusAsync()
    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) return false
    await BackgroundTask.registerTaskAsync(TASK_NAME, {
      minimumInterval: 15, // minutes; Android only, iOS decides when to run after min interval
      stopOnTerminate: false,
      startOnBoot: true,
    })
    return true
  } catch (e) {
    return false
  }
}

export async function unregisterBackgroundFetchAsync() {
  try {
    if (Constants?.appOwnership === 'expo') return true
    loadModules()
    await BackgroundTask.unregisterTaskAsync(TASK_NAME)
    return true
  } catch (e) {
    return false
  }
}

// Optional: allow manual trigger inside the app (works in Expo Go)
export async function runPrefetchNow() {
  try {
    const result = await fetchAndStoreOfflineArticles()
    return result
  } catch (e) {
    return { error: true }
  }
}
