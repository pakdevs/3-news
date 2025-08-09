import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import NewsCard from '../components/NewsCard'
import { Linking } from 'react-native'
import { APP_CONFIG, CATEGORIES } from '../utils/config'
import { getRegionCategory, getRegionTop } from '../utils/api'

export default function CategoryScreen({ navigation, route }) {
  const { categorySlug, categoryName } = route.params
  const { theme } = useTheme()
  const { markAsRead, isFollowingTopic, followTopic, unfollowTopic, region } = useApp()
  const [refreshing, setRefreshing] = useState(false)
  const [articles, setArticles] = useState([])
  const [sortBy, setSortBy] = useState('newest')

  const categoryMeta = CATEGORIES[categorySlug]
  React.useEffect(() => {
    let active = true
    ;(async () => {
      try {
        // 1) Try region category endpoint
        const remote = await getRegionCategory(region, categorySlug).catch(() => [])
        if (!active) return
        if (Array.isArray(remote) && remote.length) {
          setArticles(remote)
          return
        }

        // 2) Fallback: filter Top stories by category
        const top = await getRegionTop(region).catch(() => [])
        if (!active) return
        if (Array.isArray(top) && top.length) {
          const filtered = top.filter(
            (a) => String(a?.category || '').toLowerCase() === String(categorySlug).toLowerCase()
          )
          // Prefer filtered, otherwise show the remote Top Stories list instead of local dummy
          setArticles(filtered.length ? filtered : top)
          return
        }

        // 3) Final fallback: empty (no local dummy)
        setArticles([])
      } catch {
        if (active) setArticles([])
      }
    })()
    return () => {
      active = false
    }
  }, [categorySlug, region])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.card,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    leftButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: 4,
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    rightButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButton: {
      padding: 4,
      marginLeft: 8,
    },
    categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    categoryDetails: {
      flex: 1,
    },
    categoryDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    articleCount: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    followButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
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
      marginLeft: 8,
    },
    followingText: {
      color: '#fff',
    },
    notFollowingText: {
      color: theme.text,
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sortContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: theme.surface,
    },
    sortText: {
      fontSize: 14,
      color: theme.text,
      marginRight: 4,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  })

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    ;(async () => {
      try {
        const remote = await getRegionCategory(region, categorySlug).catch(() => [])
        if (Array.isArray(remote) && remote.length) {
          setArticles(remote)
        } else {
          const top = await getRegionTop(region).catch(() => [])
          const filtered = Array.isArray(top)
            ? top.filter(
                (a) =>
                  String(a?.category || '').toLowerCase() === String(categorySlug).toLowerCase()
              )
            : []
          // Prefer filtered, else show remote Top Stories; only if top empty, use local
          setArticles(filtered.length ? filtered : Array.isArray(top) && top.length ? top : [])
        }
      } finally {
        setRefreshing(false)
      }
    })()
  }, [categorySlug, region])

  const handleArticlePress = async (article) => {
    markAsRead(article.id)
    const tryExternal = APP_CONFIG?.content?.openExternalOnTap
    const url = article?.sourceUrl || article?.url || article?.link
    if (tryExternal && url) {
      try {
        const can = await Linking.canOpenURL(url)
        if (can) return await Linking.openURL(url)
      } catch {}
    }
    navigation.navigate('ArticleDetail', { article })
  }

  const handleFollowToggle = () => {
    const slug = categorySlug
    if (!slug) return
    if (isFollowingTopic(slug)) {
      unfollowTopic(slug)
    } else {
      followTopic({ slug, name: categoryMeta?.name || categoryName })
    }
  }

  const handleSort = () => {
    // Toggle between newest and oldest
    setSortBy((current) => (current === 'newest' ? 'oldest' : 'newest'))
  }

  const getSortedArticles = () => {
    const sorted = [...articles]
    if (sortBy === 'newest') {
      return sorted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    } else {
      return sorted.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate))
    }
  }

  const getCategoryDescription = (slug) => {
    const descriptions = {
      top: 'The most important stories from around the world',
      technology: 'Latest developments in tech, AI, and innovation',
      business: 'Market trends, finance, and corporate news',
      sports: 'Sports news, scores, and athlete stories',
      politics: 'Political developments and government news',
      health: 'Medical breakthroughs and health advice',
      science: 'Scientific discoveries and research',
      entertainment: 'Celebrity news, movies, music, and culture',
    }
    return descriptions[slug] || 'News and updates in this category'
  }

  const getCategoryIcon = (slug) => {
    const icons = {
      top: 'star',
      technology: 'laptop',
      business: 'briefcase',
      sports: 'football',
      politics: 'library',
      health: 'medical',
      science: 'flask',
      entertainment: 'musical-notes',
    }
    return icons[slug] || 'document'
  }

  const sortedArticles = getSortedArticles()
  const isFollowing = isFollowingTopic(categorySlug)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.leftButtons}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{categoryName}</Text>
          </View>

          <View style={styles.rightButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Ionicons name="search" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Info */}
        <View style={styles.categoryInfo}>
          <View style={styles.categoryDetails}>
            <Text style={styles.categoryDescription}>{getCategoryDescription(categorySlug)}</Text>
            <Text style={styles.articleCount}>
              {articles.length} article{articles.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {categoryMeta && (
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing ? styles.followingButton : styles.notFollowingButton,
              ]}
              onPress={handleFollowToggle}
            >
              <Ionicons
                name={isFollowing ? 'checkmark' : 'add'}
                size={16}
                color={isFollowing ? '#fff' : theme.text}
              />
              <Text
                style={[
                  styles.followButtonText,
                  isFollowing ? styles.followingText : styles.notFollowingText,
                ]}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
            <Text style={styles.sortText}>Sort: {sortBy === 'newest' ? 'Newest' : 'Oldest'}</Text>
            <Ionicons name="chevron-down" size={16} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {articles.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name={getCategoryIcon(categorySlug)}
            size={64}
            color={theme.textSecondary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>No Articles Yet</Text>
          <Text style={styles.emptyDescription}>
            There are no articles in this category at the moment. Check back later for updates!
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {sortedArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onPress={() => handleArticlePress(article)}
              size="large"
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
