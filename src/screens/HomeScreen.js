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
import { newsArticles as localArticles, breakingNews as localBreaking } from '../data/newsData'
import { getRegionTop, getRegionCategory } from '../utils/api'
import sanitizeArticle from '../utils/sanitizeArticle'
import { Linking } from 'react-native'
import { APP_CONFIG, CATEGORIES } from '../utils/config'
import { screenView } from '../utils/analytics'

const { width } = Dimensions.get('window')

export default function HomeScreen({ navigation, initialFeedTab = 'top' }) {
  const { theme } = useTheme()
  // Pull all needed values from useApp at the top level (do not call hooks inside helpers)
  const { markAsRead, followedTopics, isOffline, region, setRegion } = useApp()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('top')
  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState(localArticles)
  const [breaking, setBreaking] = useState(localBreaking)
  const [categoryArticles, setCategoryArticles] = useState({}) // cache per category slug
  const [categoryLoading, setCategoryLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function load() {
      screenView('Home')
      try {
        const remote = await getRegionTop(region).catch(() => [])
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
    // Reset category when switching editions to avoid empty mismatched filters
    setSelectedCategory('top')
    setCategoryArticles({})
    return () => {
      isMounted = false
    }
  }, [region])

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
    editionRow: {
      flexDirection: 'row',
      marginBottom: 0,
    },
    editionButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      marginRight: 8,
    },
    editionButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    editionButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    editionButtonTextActive: {
      color: '#fff',
    },
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    verticalSeparator: {
      width: 1,
      height: 28,
      backgroundColor: theme.border,
      marginHorizontal: 8,
    },
    separator: {
      height: 1,
      backgroundColor: theme.border,
      marginHorizontal: 16,
      marginBottom: 8,
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
      paddingHorizontal: 8,
    },
    categoryTab: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 8,
      borderRadius: 6,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    activeCategoryTab: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryTabText: {
      fontSize: 12,
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

  // Derive categories list from config (single source of truth)
  const categoriesList = React.useMemo(
    () => Object.entries(CATEGORIES).map(([slug, meta]) => ({ id: slug, slug, name: meta.name })),
    []
  )

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    ;(async () => {
      try {
        const remote = await getRegionTop(region).catch(() => [])
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
  }, [region])

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
    let base = articles
    if (selectedCategory === 'top') return base
    if (categoryArticles[selectedCategory]) return categoryArticles[selectedCategory]
    // fallback quick filter while network fetch in progress
    return base.filter(
      (article) => String(article.category || '').toLowerCase() === selectedCategory.toLowerCase()
    )
  }

  // Fetch category-specific articles when selecting a non-top category
  useEffect(() => {
    if (selectedCategory === 'top') {
      setCategoryLoading(false)
      return
    }
    // If already cached for current region, skip fetch
    if (categoryArticles[selectedCategory]) return
    let active = true
    setCategoryLoading(true)
    ;(async () => {
      try {
        const remote = await getRegionCategory(region, selectedCategory).catch(() => [])
        if (!active) return
        if (Array.isArray(remote) && remote.length) {
          const normalized = remote.map((a) => {
            const rawCat = String(a?.category || '').toLowerCase()
            if (rawCat === 'top' || rawCat === 'general' || rawCat === '') {
              return { ...a, category: selectedCategory }
            }
            return a
          })
          setCategoryArticles((prev) => ({ ...prev, [selectedCategory]: normalized }))
          return
        }
        // fallback: filter current top stories
        const filtered = articles.filter(
          (a) => String(a?.category || '').toLowerCase() === String(selectedCategory).toLowerCase()
        )
        if (filtered.length) {
          const normalizedFiltered = filtered.map((a) => ({ ...a, category: selectedCategory }))
          setCategoryArticles((prev) => ({ ...prev, [selectedCategory]: normalizedFiltered }))
        }
      } finally {
        if (active) setCategoryLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [selectedCategory, region, articles])

  // note: inline renderers only

  const renderCategoryTab = (category) => (
    <TouchableOpacity
      key={category.slug}
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

        {/* Edition + Category Tabs (single row) */}
        <View style={styles.navRow}>
          <View style={styles.editionRow}>
            {[
              { key: 'pk', label: 'Pakistan' },
              { key: 'world', label: 'World' },
            ].map((t) => (
              <TouchableOpacity
                key={t.key}
                onPress={() => setRegion(t.key)}
                style={[styles.editionButton, region === t.key && styles.editionButtonActive]}
              >
                <Text
                  style={[
                    styles.editionButtonText,
                    region === t.key && styles.editionButtonTextActive,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.verticalSeparator} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollView}
            style={{ flex: 1 }}
          >
            {categoriesList.map(renderCategoryTab)}
          </ScrollView>
        </View>
      </View>

      {/* Main content list */}
      <View style={{ flex: 1 }}>
        {loading || categoryLoading ? (
          <View style={{ paddingHorizontal: 16 }}>
            <ListSkeleton count={5} />
          </View>
        ) : (
          <FlashList
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
            data={getFilteredArticles()}
            renderItem={({ item }) => (
              <NewsCard
                article={item}
                onPress={() => handleArticlePress(item)}
                size="large"
                showSummary={false}
              />
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
                            showSummary={false}
                          />
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Section Title and optional hint */}
                <View style={{ paddingHorizontal: 0 }}>
                  <Text style={styles.sectionTitle}>
                    {selectedCategory === 'top'
                      ? `${region === 'pk' ? 'Pakistan' : 'World'} — Top Stories`
                      : `${region === 'pk' ? 'Pakistan' : 'World'} — ${
                          CATEGORIES[selectedCategory]?.name || 'News'
                        }`}
                  </Text>
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
