import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Safe string conversion to avoid _toString errors in Hermes
const safeString = (value) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

export const AppProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([])
  const [readLater, setReadLater] = useState([])
  const [followedTopics, setFollowedTopics] = useState([])
  const [followedAuthors, setFollowedAuthors] = useState([])
  const [readArticles, setReadArticles] = useState([])
  const [user, setUser] = useState(null)
  const [isOffline, setIsOffline] = useState(false)
  const [offlineArticles, setOfflineArticles] = useState([])
  const [dataSaver, setDataSaver] = useState(false)

  useEffect(() => {
    loadAppData()
  }, [])

  // Monitor network connectivity and reflect it in isOffline
  useEffect(() => {
    let mounted = true
    let intervalId = null
    let subscription = null

    async function checkOnce(Network) {
      try {
        const state = await Network.getNetworkStateAsync()
        if (!mounted) return
        const connected = !!state?.isConnected
        setIsOffline(!connected)
      } catch (e) {
        // If network state cannot be determined, do not flip existing state
      }
    }

    ;(async () => {
      try {
        const Network = require('expo-network')
        // Initial check
        await checkOnce(Network)

        // Subscribe if supported; otherwise, fallback to polling
        if (typeof Network.addNetworkStateListener === 'function') {
          subscription = Network.addNetworkStateListener((state) => {
            const connected = !!state?.isConnected
            if (mounted) setIsOffline(!connected)
          })
        } else {
          // Poll every 15s as a conservative fallback
          intervalId = setInterval(() => checkOnce(Network), 15000)
        }
      } catch (e) {
        // expo-network may not be available in some environments; ignore
      }
    })()

    return () => {
      mounted = false
      if (intervalId) clearInterval(intervalId)
      // Handle multiple possible unsubscribe shapes
      try {
        if (subscription?.remove) subscription.remove()
        // Some APIs return a function
        if (typeof subscription === 'function') subscription()
      } catch {}
    }
  }, [])

  const loadAppData = async () => {
    try {
      const [
        savedBookmarks,
        savedReadLater,
        savedFollowedTopics,
        savedFollowedAuthors,
        savedReadArticles,
        savedUser,
        savedOfflineArticles,
      ] = await Promise.all([
        AsyncStorage.getItem('bookmarks'),
        AsyncStorage.getItem('readLater'),
        AsyncStorage.getItem('followedTopics'),
        AsyncStorage.getItem('followedAuthors'),
        AsyncStorage.getItem('readArticles'),
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('offlineArticles'),
        AsyncStorage.getItem('dataSaver'),
      ])

      // Process bookmarks: ensure IDs are strings
      if (savedBookmarks) {
        const bookmarksData = JSON.parse(savedBookmarks)
        const bookmarksWithStringIds = bookmarksData.map((bookmark) => ({
          ...bookmark,
          id: safeString(bookmark.id),
        }))
        setBookmarks(bookmarksWithStringIds)
      }

      // Process read later: ensure IDs are strings
      if (savedReadLater) {
        const readLaterData = JSON.parse(savedReadLater)
        const readLaterWithStringIds = readLaterData.map((item) => ({
          ...item,
          id: safeString(item.id),
        }))
        setReadLater(readLaterWithStringIds)
      }

      if (savedFollowedTopics) setFollowedTopics(JSON.parse(savedFollowedTopics))
      if (savedFollowedAuthors) setFollowedAuthors(JSON.parse(savedFollowedAuthors))

      // Process read articles: ensure all IDs are strings
      if (savedReadArticles) {
        const readArticlesData = JSON.parse(savedReadArticles)
        const readArticlesWithStringIds = readArticlesData.map((id) => safeString(id))
        setReadArticles(readArticlesWithStringIds)
      }

      if (savedUser) setUser(JSON.parse(savedUser))

      // Process offline articles: ensure IDs are strings
      if (savedOfflineArticles) {
        const offlineData = JSON.parse(savedOfflineArticles)
        const offlineWithStringIds = offlineData.map((article) => ({
          ...article,
          id: safeString(article.id),
        }))
        setOfflineArticles(offlineWithStringIds)
      }

      if (savedUser) setUser(JSON.parse(savedUser))

      // Data saver
      if (arguments[0]) {
        // no-op to keep arg index stable
      }
      const dataSaverRaw = await AsyncStorage.getItem('dataSaver')
      if (dataSaverRaw !== null) setDataSaver(dataSaverRaw === 'true')
    } catch (_error) {}
  }

  const saveData = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data))
    } catch (_error) {}
  }

  const addBookmark = (article) => {
    if (!article) return

    // Ensure article has string ID
    const safeArticle = {
      ...article,
      id: safeString(article.id),
    }

    const newBookmarks = [...bookmarks, safeArticle]
    setBookmarks(newBookmarks)
    saveData('bookmarks', newBookmarks)
  }

  const removeBookmark = (articleId) => {
    // Convert to string to ensure consistent comparison
    const idString = safeString(articleId)
    const newBookmarks = bookmarks.filter((article) => safeString(article.id) !== idString)
    setBookmarks(newBookmarks)
    saveData('bookmarks', newBookmarks)
  }

  const isBookmarked = (articleId) => {
    // Handle null/undefined case
    if (!articleId) return false

    // Convert to string to ensure consistent comparison
    const idString = safeString(articleId)
    return bookmarks.some((article) => safeString(article.id) === idString)
  }

  const addToReadLater = (article) => {
    if (!article) return

    // Ensure article has string ID
    const safeArticle = {
      ...article,
      id: safeString(article.id),
    }

    const newReadLater = [...readLater, safeArticle]
    setReadLater(newReadLater)
    saveData('readLater', newReadLater)
  }

  const removeFromReadLater = (articleId) => {
    // Convert to string to ensure consistent comparison
    const idString = safeString(articleId)
    const newReadLater = readLater.filter((article) => safeString(article.id) !== idString)
    setReadLater(newReadLater)
    saveData('readLater', newReadLater)
  }

  const isInReadLater = (articleId) => {
    // Handle null/undefined case
    if (!articleId) return false

    // Convert to string to ensure consistent comparison
    const idString = safeString(articleId)
    return readLater.some((article) => safeString(article.id) === idString)
  }

  const followTopic = (topic) => {
    const newFollowedTopics = [...followedTopics, topic]
    setFollowedTopics(newFollowedTopics)
    saveData('followedTopics', newFollowedTopics)
  }

  const unfollowTopic = (topicSlug) => {
    const newFollowedTopics = followedTopics.filter((topic) => topic.slug !== topicSlug)
    setFollowedTopics(newFollowedTopics)
    saveData('followedTopics', newFollowedTopics)
  }

  const isFollowingTopic = (topicSlug) => {
    return followedTopics.some((topic) => topic.slug === topicSlug)
  }

  const followAuthor = (author) => {
    const newFollowedAuthors = [...followedAuthors, author]
    setFollowedAuthors(newFollowedAuthors)
    saveData('followedAuthors', newFollowedAuthors)
  }

  const unfollowAuthor = (authorName) => {
    const newFollowedAuthors = followedAuthors.filter((author) => author.name !== authorName)
    setFollowedAuthors(newFollowedAuthors)
    saveData('followedAuthors', newFollowedAuthors)
  }

  const isFollowingAuthor = (authorName) => {
    return followedAuthors.some((author) => author.name === authorName)
  }

  const markAsRead = (articleId) => {
    // Convert to string to ensure consistent comparison
    const idString = safeString(articleId)

    if (!readArticles.includes(idString)) {
      const newReadArticles = [...readArticles, idString]
      setReadArticles(newReadArticles)
      saveData('readArticles', newReadArticles)
    }
  }

  const isRead = (articleId) => {
    // Convert to string to ensure consistent comparison
    if (!articleId) return false
    const idString = safeString(articleId)
    return readArticles.includes(idString)
  }

  const saveForOffline = (article) => {
    const newOfflineArticles = [...offlineArticles, article]
    setOfflineArticles(newOfflineArticles)
    saveData('offlineArticles', newOfflineArticles)
  }

  const removeFromOffline = (articleId) => {
    const newOfflineArticles = offlineArticles.filter((article) => article.id !== articleId)
    setOfflineArticles(newOfflineArticles)
    saveData('offlineArticles', newOfflineArticles)
  }

  const clearOffline = async () => {
    try {
      setOfflineArticles([])
      await AsyncStorage.setItem('offlineArticles', JSON.stringify([]))
    } catch (_e) {}
  }

  const login = (userData) => {
    setUser(userData)
    saveData('user', userData)
  }

  const logout = () => {
    setUser(null)
    AsyncStorage.removeItem('user')
  }

  const toggleDataSaver = async () => {
    const next = !dataSaver
    setDataSaver(next)
    await AsyncStorage.setItem('dataSaver', next ? 'true' : 'false')
  }

  const value = {
    // Bookmarks
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,

    // Read Later
    readLater,
    addToReadLater,
    removeFromReadLater,
    isInReadLater,

    // Following
    followedTopics,
    followTopic,
    unfollowTopic,
    isFollowingTopic,
    followedAuthors,
    followAuthor,
    unfollowAuthor,
    isFollowingAuthor,

    // Reading Progress
    readArticles,
    markAsRead,
    isRead,

    // Offline
    isOffline,
    setIsOffline,
    offlineArticles,
    saveForOffline,
    removeFromOffline,
    clearOffline,

    // Network/Data
    dataSaver,
    toggleDataSaver,

    // User
    user,
    login,
    logout,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
