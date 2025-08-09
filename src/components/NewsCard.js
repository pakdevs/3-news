import React, { useState, useCallback, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../utils/config'
import { isValidUrl } from '../utils/helpers'

// Aspect-ratio note: we dynamically apply backend-provided aspectRatio (clamped) when available

// showSummary: opt-in flag (default true). For HomeScreen we will pass false for headline-only.
function NewsCard({ article, onPress, size = 'large', showSummary = true, showReadStatus = true }) {
  const { theme } = useTheme()
  const { isBookmarked, addBookmark, removeBookmark, isRead, dataSaver } = useApp()
  const [imageFailed, setImageFailed] = useState(false)

  // Defensive: sanitize all article properties to primitives
  const safeArticle = {
    id: article && article.id !== undefined && article.id !== null ? String(article.id) : '',
    imageUrl: article && article.imageUrl ? String(article.imageUrl) : '',
    hasImage: !!(article && article.hasImage),
    isBreaking: !!(article && article.isBreaking),
    category: article && article.category ? String(article.category) : 'General',
    title: article && article.title ? String(article.title) : 'No title available',
    summary: article && article.summary ? String(article.summary) : 'No summary available',
    author: article && article.author ? String(article.author) : 'Unknown author',
    sourceName: article && article.sourceName ? String(article.sourceName) : '',
    sourceIcon: article && article.sourceIcon ? String(article.sourceIcon) : '',
    displaySourceName:
      article && article.displaySourceName
        ? String(article.displaySourceName)
        : article && article.sourceName
        ? String(article.sourceName)
        : '',
    publishDate: article && article.publishDate ? String(article.publishDate) : '',
    readTime: article && article.readTime ? String(article.readTime) : '1 min read',
    // likes & shares removed from UI; retain (if needed later) but not used
    likes: 0,
    shares: 0,
  }
  const articleId = safeArticle.id

  // Clamp aspect ratio to a sane range to avoid extreme layout shifts
  const clampedAspectRatio = useMemo(() => {
    const ar = Number(article?.aspectRatio || safeArticle.aspectRatio)
    if (!ar || !isFinite(ar) || ar <= 0) return null
    return Math.min(2, Math.max(0.5, ar)) // clamp between 0.5 (tall) and 2 (wide)
  }, [article?.aspectRatio, safeArticle.aspectRatio])

  // Validate source icon URL
  const validSourceIcon =
    safeArticle.sourceIcon && isValidUrl(safeArticle.sourceIcon) ? safeArticle.sourceIcon : ''
  // Abbreviation retained only for fallback where display name absent
  const sourceAbbrev = useMemo(
    () => (safeArticle.displaySourceName || safeArticle.sourceName || 'SRC').slice(0, 3),
    [safeArticle.displaySourceName, safeArticle.sourceName]
  )

  // Early return if no article data
  if (!article || typeof article !== 'object') {
    return (
      <View style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 16 }}>
        <Text style={{ color: '#666', textAlign: 'center' }}>No article data available</Text>
      </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderRadius: 12,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.07,
      shadowRadius: 2,
      elevation: 2,
    },
    pressable: {
      borderRadius: 12,
      overflow: 'hidden',
    },
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: '100%',
      height: size === 'large' ? 200 : size === 'medium' ? 150 : 120,
    },
    imagePlaceholder: {
      width: '100%',
      height: size === 'large' ? 200 : size === 'medium' ? 150 : 120,
      backgroundColor: theme.surfaceAlt || '#222',
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderText: {
      color: theme.textSecondary,
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
      opacity: 0.55,
      textAlign: 'center',
      paddingHorizontal: 12,
      lineHeight: 20,
    },
    breakingBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: theme.breaking,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    breakingText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    bookmarkButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      padding: 16,
    },
    category: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.primary,
      textTransform: 'uppercase',
      // spacing handled by headerRow
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    dotSeparator: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.textSecondary,
      opacity: 0.4,
      marginHorizontal: 8,
      marginTop: 1,
    },
    title: {
      fontSize: size === 'large' ? 18 : size === 'medium' ? 16 : 14,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
      lineHeight: size === 'large' ? 24 : size === 'medium' ? 22 : 20,
    },
    readTitle: {
      opacity: 0.7,
    },
    summary: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 12,
    },
    sourceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    sourceLogo: {
      width: 18,
      height: 18,
      borderRadius: 9,
      marginRight: 6,
      backgroundColor: theme.surfaceAlt || theme.surface,
    },
    sourceBadge: {
      backgroundColor: theme.surfaceAlt || theme.surface,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 6,
    },
    sourceText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    authorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    authorText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    readTime: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    // engagement styles removed
    readIndicator: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.textSecondary,
      opacity: 0.5,
      marginRight: 8,
      marginTop: 6,
    },
  })

  const handleBookmark = (e) => {
    e.stopPropagation()
    if (!articleId) return
    if (isBookmarked(articleId)) {
      removeBookmark(articleId)
    } else {
      addBookmark(safeArticle)
    }
  }

  const metaLine = useMemo(() => {
    const datePart = formatDate(safeArticle.publishDate)
    const rt = safeArticle.readTime
    return `${datePart} • ${rt}`
  }, [safeArticle.publishDate, safeArticle.readTime])

  const onImageError = useCallback(() => setImageFailed(true), [])

  function formatDate(dateString) {
    if (!dateString) return 'Unknown date'
    try {
      const date = new Date(String(dateString))
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays <= 7) return `${diffDays} days ago`
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (_error) {
      return 'Invalid date'
    }
  }

  // formatNumber removed (engagement metrics not displayed)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pressable}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${safeArticle.title}. ${
          CATEGORIES[safeArticle.category]?.name || safeArticle.category
        } category. ${safeArticle.displaySourceName || ''}. ${metaLine}`}
        activeOpacity={0.85}
      >
        <View style={styles.imageContainer}>
          {!imageFailed && safeArticle.hasImage && safeArticle.imageUrl ? (
            <Image
              source={{ uri: safeArticle.imageUrl }}
              style={[
                styles.image,
                clampedAspectRatio && { aspectRatio: clampedAspectRatio, height: undefined },
              ]}
              contentFit={dataSaver ? 'contain' : 'cover'}
              transition={100}
              cachePolicy={dataSaver ? 'memory' : 'memory-disk'}
              onError={onImageError}
            />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                clampedAspectRatio && { aspectRatio: clampedAspectRatio, height: undefined },
              ]}
            >
              <Text style={styles.placeholderText} numberOfLines={2}>
                {(safeArticle.displaySourceName || sourceAbbrev).toUpperCase()}
              </Text>
            </View>
          )}

          {safeArticle.isBreaking && (
            <View style={styles.breakingBadge}>
              <Text style={styles.breakingText}>BREAKING</Text>
            </View>
          )}

          <TouchableOpacity style={styles.bookmarkButton} onPress={handleBookmark}>
            <Ionicons
              name={isBookmarked(articleId) ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.category} numberOfLines={1}>
              {CATEGORIES[safeArticle.category]?.name || safeArticle.category}
            </Text>
            {(validSourceIcon || safeArticle.displaySourceName) && (
              <>
                <View style={styles.dotSeparator} />
                {validSourceIcon ? (
                  <Image
                    source={{ uri: validSourceIcon }}
                    style={[styles.sourceLogo, { opacity: 0.9 }]}
                    contentFit="contain"
                    accessibilityLabel={safeArticle.displaySourceName || 'Source'}
                  />
                ) : (
                  <View style={styles.sourceBadge}>
                    <Text
                      style={[styles.sourceText, { maxWidth: 120, opacity: 0.85 }]}
                      numberOfLines={1}
                    >
                      {sourceAbbrev}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            {showReadStatus && isRead(articleId) && (
              <View style={styles.readIndicator} accessibilityLabel="Read article" />
            )}
            <Text style={[styles.title, isRead(articleId) && styles.readTitle]}>{safeArticle.title}</Text>
          </View>

          {size !== 'small' && showSummary && safeArticle.summary && (
            <Text style={styles.summary} numberOfLines={2}>
              {safeArticle.summary}
            </Text>
          )}

          <View style={styles.footer}>
            <Text style={[styles.authorText, { flex: 1 }]} numberOfLines={1}>
              {metaLine}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

// Memoize to avoid unnecessary re-renders in large lists
export default React.memo(NewsCard, (prev, next) => {
  const a = prev.article
  const b = next.article
  if (a === b) {
    return (
      prev.showSummary === next.showSummary &&
      prev.size === next.size &&
      prev.showReadStatus === next.showReadStatus
    )
  }
  // Basic shallow comparisons for key props used in UI
  return (
    a?.id === b?.id &&
    a?.title === b?.title &&
    a?.imageUrl === b?.imageUrl &&
    a?.category === b?.category &&
    a?.publishDate === b?.publishDate &&
    a?.readTime === b?.readTime &&
    a?.sourceIcon === b?.sourceIcon &&
    a?.displaySourceName === b?.displaySourceName &&
    prev.showSummary === next.showSummary &&
    prev.size === next.size &&
    prev.showReadStatus === next.showReadStatus
  )
})
