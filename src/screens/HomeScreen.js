import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import NewsCard from '../components/NewsCard'
import { ListSkeleton } from '../components/Skeletons'
import { FlashList } from '@shopify/flash-list'
import { newsArticles, breakingNews, categories } from '../data/newsData'
import sanitizeArticle from '../utils/sanitizeArticle'
import { screenView } from '../utils/analytics'

const { width } = Dimensions.get('window')

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme()
  // Pull all needed values from useApp at the top level (do not call hooks inside helpers)
  const { markAsRead, followedTopics } = useApp()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('top')
  const [feedTab, setFeedTab] = useState('top') // 'top' | 'foryou' | 'trending'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate initial fetch
    const t = setTimeout(() => setLoading(false), 600)
    screenView('Home')
    return () => clearTimeout(t)
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
    // Simulate loading new data
    setTimeout(() => {
      setRefreshing(false)
    }, 800)
  }, [])

  const handleArticlePress = (article) => {
    markAsRead(article.id)
    const sanitizedArticle = sanitizeArticle(article)
    navigation.navigate('ArticleDetail', { article: sanitizedArticle })
  }

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug)
  }

  const getFilteredArticles = () => {
    let base = []
    if (feedTab === 'trending') {
      base = [...newsArticles].sort((a, b) => b.likes + b.shares - (a.likes + a.shares))
    } else if (feedTab === 'foryou') {
      // For You: prioritize followed topics if any; fallback to top
      if (followedTopics && followedTopics.length) {
        const slugs = new Set(followedTopics.map((t) => t.slug))
        base = newsArticles.filter((a) => slugs.has(a.category))
      } else {
        base = newsArticles
      }
    } else {
      base = newsArticles
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
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color={theme.text} />
          </TouchableOpacity>

          <Text style={styles.logo}>NewsApp</Text>

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

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Breaking News Section */}
        {breakingNews.length > 0 && !loading && (
          <View style={styles.breakingSection}>
            <View style={styles.breakingHeader}>
              <Ionicons name="flash" size={20} color={theme.breaking} />
              <Text style={styles.breakingTitle}>Breaking News</Text>
            </View>
            <FlashList
              data={breakingNews}
              renderItem={renderBreakingNewsItem}
              keyExtractor={(item) => item.id}
              horizontal
              estimatedItemSize={width * 0.8}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {/* Main News Section */}
        <View style={styles.newsSection}>
          <Text style={styles.sectionTitle}>
            {feedTab === 'foryou'
              ? 'For You'
              : feedTab === 'trending'
              ? 'Trending'
              : selectedCategory === 'top'
              ? 'Top Stories'
              : categories.find((cat) => cat.slug === selectedCategory)?.name || 'News'}
          </Text>

          {feedTab === 'foryou' && !loading && getFilteredArticles().length === 0 ? (
            <Text style={styles.loadingText}>
              Follow some topics in Sections to personalize your feed.
            </Text>
          ) : loading ? (
            <ListSkeleton count={5} />
          ) : (
            <FlashList
              data={getFilteredArticles()}
              renderItem={({ item }) => (
                <NewsCard article={item} onPress={() => handleArticlePress(item)} size="large" />
              )}
              keyExtractor={(item) => item.id}
              estimatedItemSize={280}
            />
          )}

          {!loading && getFilteredArticles().length === 0 && (
            <Text style={styles.loadingText}>No articles found in this category.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
