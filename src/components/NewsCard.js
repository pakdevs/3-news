import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'

const { width } = Dimensions.get('window')

export default function NewsCard({ article, onPress, size = 'large' }) {
  const { theme } = useTheme()
  const { isBookmarked, addBookmark, removeBookmark, isRead } = useApp()

  // Defensive: sanitize all article properties to primitives
  const safeArticle = {
    id: article && article.id !== undefined && article.id !== null ? String(article.id) : '',
    imageUrl: article && article.imageUrl ? String(article.imageUrl) : '',
    isBreaking: !!(article && article.isBreaking),
    category: article && article.category ? String(article.category) : 'General',
    title: article && article.title ? String(article.title) : 'No title available',
    summary: article && article.summary ? String(article.summary) : 'No summary available',
    author: article && article.author ? String(article.author) : 'Unknown author',
    publishDate: article && article.publishDate ? String(article.publishDate) : '',
    readTime: article && article.readTime ? String(article.readTime) : '1 min read',
    likes:
      article && article.likes !== undefined && article.likes !== null && !isNaN(article.likes)
        ? Number(article.likes)
        : 0,
    shares:
      article && article.shares !== undefined && article.shares !== null && !isNaN(article.shares)
        ? Number(article.shares)
        : 0,
  }
  const articleId = safeArticle.id

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
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
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
      resizeMode: 'cover',
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
      marginBottom: 8,
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
    engagement: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    engagementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    engagementText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: 4,
    },
    readIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
      marginRight: 8,
    },
  })

  const handleBookmark = (e) => {
    e.stopPropagation()
    if (!articleId) {
      console.warn('No article ID available for bookmarking')
      return
    }
    if (isBookmarked(articleId)) {
      removeBookmark(articleId)
    } else {
      addBookmark(safeArticle)
    }
  }

  const formatDate = (dateString) => {
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
    } catch (error) {
      console.warn('Date formatting error:', error)
      return 'Invalid date'
    }
  }

  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0'
    try {
      const numValue = Number(num)
      if (!isFinite(numValue)) return '0'
      if (numValue >= 1000) {
        return (numValue / 1000).toFixed(1) + 'k'
      }
      return String(numValue)
    } catch (error) {
      console.warn('Number formatting error:', error)
      return '0'
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pressable} onPress={onPress}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: safeArticle.imageUrl }} style={styles.image} />

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
          <Text style={styles.category}>{safeArticle.category}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            {isRead(articleId) && <View style={styles.readIndicator} />}
            <Text style={[styles.title, isRead(articleId) && styles.readTitle]}>
              {safeArticle.title}
            </Text>
          </View>

          {size !== 'small' && (
            <Text style={styles.summary} numberOfLines={2}>
              {safeArticle.summary}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.authorInfo}>
              <Text style={styles.authorText}>
                {safeArticle.author} • {formatDate(safeArticle.publishDate)}
              </Text>
            </View>
            <Text style={styles.readTime}>{safeArticle.readTime}</Text>
          </View>

          {size === 'large' && (
            <View style={styles.engagement}>
              <View style={styles.engagementItem}>
                <Ionicons name="heart-outline" size={14} color={theme.textSecondary} />
                <Text style={styles.engagementText}>{formatNumber(safeArticle.likes)}</Text>
              </View>
              <View style={styles.engagementItem}>
                <Ionicons name="share-outline" size={14} color={theme.textSecondary} />
                <Text style={styles.engagementText}>{formatNumber(safeArticle.shares)}</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}
