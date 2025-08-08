import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Dimensions,
  Alert,
} from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { screenView } from '../utils/analytics'

const { width } = Dimensions.get('window')

export default function ArticleDetailScreen({ navigation, route }) {
  // Defensive: sanitize all article properties to primitives
  const rawArticle = route.params.article
  const article = {
    id:
      rawArticle && rawArticle.id !== undefined && rawArticle.id !== null
        ? String(rawArticle.id)
        : '',
    imageUrl: rawArticle && rawArticle.imageUrl ? String(rawArticle.imageUrl) : '',
    isBreaking: !!(rawArticle && rawArticle.isBreaking),
    category: rawArticle && rawArticle.category ? String(rawArticle.category) : 'General',
    title: rawArticle && rawArticle.title ? String(rawArticle.title) : 'No title available',
    summary: rawArticle && rawArticle.summary ? String(rawArticle.summary) : 'No summary available',
    author: rawArticle && rawArticle.author ? String(rawArticle.author) : 'Unknown author',
    publishDate: rawArticle && rawArticle.publishDate ? String(rawArticle.publishDate) : '',
    readTime: rawArticle && rawArticle.readTime ? String(rawArticle.readTime) : '1 min read',
    likes:
      rawArticle &&
      rawArticle.likes !== undefined &&
      rawArticle.likes !== null &&
      !isNaN(rawArticle.likes)
        ? Number(rawArticle.likes)
        : 0,
    shares:
      rawArticle &&
      rawArticle.shares !== undefined &&
      rawArticle.shares !== null &&
      !isNaN(rawArticle.shares)
        ? Number(rawArticle.shares)
        : 0,
    content: rawArticle && rawArticle.content ? String(rawArticle.content) : '',
  }
  const { theme } = useTheme()
  const {
    isBookmarked,
    addBookmark,
    removeBookmark,
    isInReadLater,
    addToReadLater,
    removeFromReadLater,
    markAsRead,
    saveForOffline,
    isFollowingAuthor,
    followAuthor,
    unfollowAuthor,
  } = useApp()

  const [fontSize, setFontSize] = useState(16)
  const [liked, setLiked] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  useEffect(() => {
    // Mark article as read when component mounts
    markAsRead(article.id)
    screenView('ArticleDetail')
  }, [article.id])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.card,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    leftButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rightButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButton: {
      padding: 8,
      marginHorizontal: 4,
    },
    content: {
      flex: 1,
    },
    heroImage: {
      width: '100%',
      height: 250,
    },
    articleHeader: {
      padding: 20,
    },
    category: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.primary,
      textTransform: 'uppercase',
      marginBottom: 12,
    },
    breakingBadge: {
      backgroundColor: theme.breaking,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      alignSelf: 'flex-start',
      marginBottom: 12,
    },
    breakingText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      lineHeight: 32,
      marginBottom: 12,
    },
    summary: {
      fontSize: 18,
      color: theme.textSecondary,
      lineHeight: 26,
      marginBottom: 20,
    },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.border,
    },
    authorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    authorAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    authorDetails: {
      flex: 1,
    },
    authorName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    publishDate: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    followButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1,
    },
    followingButton: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    notFollowingButton: {
      backgroundColor: 'transparent',
      borderColor: theme.border,
    },
    followButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    followingText: {
      color: '#fff',
    },
    notFollowingText: {
      color: theme.text,
    },
    readTime: {
      fontSize: 14,
      color: theme.textSecondary,
      marginLeft: 12,
    },
    bodyText: {
      fontSize: fontSize,
      lineHeight: fontSize * 1.6,
      color: theme.text,
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    engagement: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    engagementLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    engagementButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      marginRight: 12,
    },
    likeButton: {
      backgroundColor: liked ? theme.error : 'transparent',
    },
    engagementText: {
      fontSize: 14,
      marginLeft: 6,
      color: liked ? '#fff' : theme.text,
    },
    shareCount: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 20,
      paddingHorizontal: 20,
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderColor: theme.border,
    },
    actionButton: {
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    actionButtonText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
    },
    activeActionText: {
      color: theme.primary,
    },
    fontSizeControls: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderColor: theme.border,
    },
    fontSizeText: {
      fontSize: 14,
      color: theme.text,
      marginHorizontal: 12,
    },
    fontSizeButton: {
      padding: 8,
      borderRadius: 4,
      backgroundColor: theme.surface,
    },
  })

  const handleBack = () => {
    navigation.goBack()
  }

  const handleBookmark = () => {
    if (isBookmarked(article.id)) {
      removeBookmark(article.id)
    } else {
      addBookmark(article)
    }
  }

  const handleReadLater = () => {
    if (isInReadLater(article.id)) {
      removeFromReadLater(article.id)
    } else {
      addToReadLater(article)
    }
  }

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this article: ${article.title}\n\n${article.summary}`,
        url: `https://newsapp.com/article/${article.id}`,
        title: article.title,
      })
    } catch (error) {
      Alert.alert('Error', 'Could not share the article')
    }
  }

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleFollowAuthor = () => {
    const authorData = {
      name: article.author,
      bio: 'News correspondent',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    }

    if (isFollowingAuthor(article.author)) {
      unfollowAuthor(article.author)
    } else {
      followAuthor(authorData)
    }
  }

  const handleSaveOffline = () => {
    saveForOffline(article)
    Alert.alert('Saved', 'Article saved for offline reading')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const increaseFontSize = () => {
    if (fontSize < 20) {
      setFontSize(fontSize + 2)
    }
  }

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 2)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.rightButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleBookmark}>
            <Ionicons
              name={isBookmarked(article.id) ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isBookmarked(article.id) ? theme.primary : theme.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: article.imageUrl }}
          style={styles.heroImage}
          contentFit={useApp().dataSaver ? 'contain' : 'cover'}
          transition={150}
          cachePolicy={useApp().dataSaver ? 'memory' : 'memory-disk'}
        />

        <View style={styles.articleHeader}>
          {article.isBreaking && (
            <View style={styles.breakingBadge}>
              <Text style={styles.breakingText}>BREAKING NEWS</Text>
            </View>
          )}

          <Text style={styles.category}>{article.category}</Text>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.summary}>{article.summary}</Text>

          <View style={styles.meta}>
            <View style={styles.authorInfo}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                }}
                style={styles.authorAvatar}
              />
              <View style={styles.authorDetails}>
                <Text style={styles.authorName}>{article.author}</Text>
                <Text style={styles.publishDate}>{formatDate(article.publishDate)}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  isFollowingAuthor(article.author)
                    ? styles.followingButton
                    : styles.notFollowingButton,
                ]}
                onPress={handleFollowAuthor}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    isFollowingAuthor(article.author)
                      ? styles.followingText
                      : styles.notFollowingText,
                  ]}
                >
                  {isFollowingAuthor(article.author) ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.readTime}>{article.readTime}</Text>
          </View>
        </View>

        {/* Font Size Controls */}
        <View style={styles.fontSizeControls}>
          <Text style={styles.fontSizeText}>Text Size:</Text>
          <TouchableOpacity style={styles.fontSizeButton} onPress={decreaseFontSize}>
            <Ionicons name="remove" size={16} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.fontSizeText}>A</Text>
          <TouchableOpacity style={styles.fontSizeButton} onPress={increaseFontSize}>
            <Ionicons name="add" size={16} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Article Content */}
        <Text style={styles.bodyText}>{article.content}</Text>

        {/* Engagement */}
        <View style={styles.engagement}>
          <View style={styles.engagementLeft}>
            <TouchableOpacity
              style={[styles.engagementButton, styles.likeButton]}
              onPress={handleLike}
            >
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={20}
                color={liked ? '#fff' : theme.text}
              />
              <Text style={styles.engagementText}>{liked ? article.likes + 1 : article.likes}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.shareCount}>{article.shares} shares</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleReadLater}>
            <Ionicons
              name={isInReadLater(article.id) ? 'time' : 'time-outline'}
              size={24}
              color={isInReadLater(article.id) ? theme.primary : theme.textSecondary}
            />
            <Text
              style={[
                styles.actionButtonText,
                isInReadLater(article.id) && styles.activeActionText,
              ]}
            >
              {isInReadLater(article.id) ? 'Saved for Later' : 'Read Later'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleSaveOffline}>
            <Ionicons name="download-outline" size={24} color={theme.textSecondary} />
            <Text style={styles.actionButtonText}>Save Offline</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={theme.textSecondary} />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
