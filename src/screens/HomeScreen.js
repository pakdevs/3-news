import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import NewsCard from '../components/NewsCard'
import { ListSkeleton } from '../components/Skeletons'
import OfflineBanner from '../components/OfflineBanner'
import { FlashList } from '@shopify/flash-list'
import {
  newsArticles as localArticles,
  breakingNews as localBreaking,
  categories,
} from '../data/newsData'
import { getTopArticles } from '../utils/api'
import sanitizeArticle from '../utils/sanitizeArticle'
import { Linking } from 'react-native'
import { APP_CONFIG } from '../utils/config'
import { screenView } from '../utils/analytics'

const { width } = Dimensions.get('window')

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme()
  // Pull all needed values from useApp at the top level (do not call hooks inside helpers)
  const { markAsRead, followedTopics, isOffline } = useApp()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('top')
  const [feedTab, setFeedTab] = useState('top') // 'top' | 'foryou' | 'trending'
  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState(localArticles)
  const [breaking, setBreaking] = useState(localBreaking)

  useEffect(() => {
    let isMounted = true
    async function load() {
      screenView('Home')
      try {
        const remote = await getTopArticles().catch(() => [])
        if (!isMounted) return
        if (remote && remote.length) {
          setArticles(remote)
          // naive breaking selection: top 5 with isBreaking or most shares
          const topBreaking = remote.filter((a) => a.isBreaking).slice(0, 5)
          setBreaking(topBreaking.length ? topBreaking : remote.slice(0, 5))
        } else {
          setArticles(localArticles)
          setBreaking(localBreaking)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.card,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    menuButton: {
      padding: 4,
    },
    logo: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.primary,
    },
    searchButton: {
      padding: 4,
    },
    breakingSection: {
      marginBottom: 16,
    },
    breakingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    breakingTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginLeft: 8,
    },
    breakingCard: {
      marginLeft: 16,
      width: width * 0.8,
    },
    categoryTabs: {
      marginBottom: 16,
    },
    feedTabs: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    feedTab: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      marginRight: 8,
    },
    activeFeedTab: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    feedTabText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    activeFeedTabText: {
      color: '#fff',
    },
    categoryScrollView: {
      paddingHorizontal: 16,
    },
    categoryTab: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginRight: 12,
      borderRadius: 20,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    activeCategoryTab: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryTabText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    activeCategoryTabText: {
      color: '#fff',
    },
    newsSection: {
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    loadingText: {
      textAlign: 'center',
      color: theme.textSecondary,
      marginTop: 20,
    },
  })

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    ;(async () => {
      try {
        const remote = await getTopArticles().catch(() => [])
        if (remote && remote.length) {
          setArticles(remote)
          const topBreaking = remote.filter((a) => a.isBreaking).slice(0, 5)
          setBreaking(topBreaking.length ? topBreaking : remote.slice(0, 5))
        } else {
          setArticles(localArticles)
          setBreaking(localBreaking)
        }
      } finally {
        setRefreshing(false)
      }
    })()
  }, [])

  const handleArticlePress = async (article) => {
    markAsRead(article.id)
    const tryExternal = APP_CONFIG?.content?.openExternalOnTap
    const url = article?.sourceUrl || article?.url || article?.link
    if (tryExternal && url) {
      try {
        const can = await Linking.canOpenURL(url)
        if (can) {
          await Linking.openURL(url)
          return
        }
      } catch {}
    }
    const sanitizedArticle = sanitizeArticle(article)
    navigation.navigate('ArticleDetail', { article: sanitizedArticle })
  }

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug)
  }

  const getFilteredArticles = () => {
    let base = []
    if (feedTab === 'trending') {
      base = [...articles].sort((a, b) => b.likes + b.shares - (a.likes + a.shares))
    } else if (feedTab === 'foryou') {
      // For You: prioritize followed topics if any; fallback to top
      if (followedTopics && followedTopics.length) {
        const slugs = new Set(followedTopics.map((t) => t.slug))
        base = articles.filter((a) => slugs.has(a.category))
      } else {
        base = articles
      }
    } else {
      base = articles
    }
    if (selectedCategory === 'top') return base
    return base.filter((article) => article.category === selectedCategory)
  }

  const renderBreakingNewsItem = ({ item }) => (
    <View style={styles.breakingCard}>
      <NewsCard article={item} onPress={() => handleArticlePress(item)} size="medium" />
    </View>
  )

  const renderCategoryTab = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryTab, selectedCategory === category.slug && styles.activeCategoryTab]}
      onPress={() => handleCategoryChange(category.slug)}
    >
      <Text
        style={[
          styles.categoryTabText,
          selectedCategory === category.slug && styles.activeCategoryTabText,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      {isOffline && <OfflineBanner onRetry={() => onRefresh()} />}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color={theme.text} />
          </TouchableOpacity>

          <Text style={styles.logo}>The Pakistan Tribune</Text>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryTabs}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollView}
          >
            {categories.map(renderCategoryTab)}
          </ScrollView>
        </View>
      </View>

      {/* Feed tabs */}
      <View style={styles.feedTabs}>
        {[
          { key: 'top', label: 'Top' },
          { key: 'foryou', label: 'For You' },
          { key: 'trending', label: 'Trending' },
        ].map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setFeedTab(t.key)}
            style={[styles.feedTab, feedTab === t.key && styles.activeFeedTab]}
          >
            <Text style={[styles.feedTabText, feedTab === t.key && styles.activeFeedTabText]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main content list */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={{ paddingHorizontal: 16 }}>
            <ListSkeleton count={5} />
          </View>
        ) : (
          <FlashList
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, flexGrow: 1 }}
            data={getFilteredArticles()}
            renderItem={({ item }) => (
              <NewsCard article={item} onPress={() => handleArticlePress(item)} size="large" />
            )}
            keyExtractor={(item) => item.id}
            estimatedItemSize={280}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListHeaderComponent={
              <View>
                {/* Breaking News Section */}
                {breaking.length > 0 && (
                  <View style={styles.breakingSection}>
                    <View style={styles.breakingHeader}>
                      <Ionicons name="flash" size={20} color={theme.breaking} />
                      <Text style={styles.breakingTitle}>Breaking News</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {breaking.map((item) => (
                        <View style={styles.breakingCard} key={item.id}>
                          <NewsCard
                            article={item}
                            onPress={() => handleArticlePress(item)}
                            size="medium"
                          />
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Section Title and optional hint */}
                <View style={{ paddingHorizontal: 0 }}>
                  <Text style={styles.sectionTitle}>
                    {feedTab === 'foryou'
                      ? 'For You'
                      : feedTab === 'trending'
                      ? 'Trending'
                      : selectedCategory === 'top'
                      ? 'Top Stories'
                      : categories.find((cat) => cat.slug === selectedCategory)?.name || 'News'}
                  </Text>
                  {feedTab === 'foryou' && getFilteredArticles().length === 0 ? (
                    <Text style={styles.loadingText}>
                      Follow some topics in Sections to personalize your feed.
                    </Text>
                  ) : null}
                </View>
              </View>
            }
            ListEmptyComponent={
              <Text style={styles.loadingText}>No articles found in this category.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  )
}
