import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import NewsCard from '../components/NewsCard'
import { Linking } from 'react-native'
import { APP_CONFIG } from '../utils/config'
import { searchArticles as localSearch } from '../data/newsData'
import { CATEGORIES } from '../utils/config'
import { searchArticlesApi, getTopArticles } from '../utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { screenView } from '../utils/analytics'

export default function SearchScreen({ navigation }) {
  const { theme } = useTheme()
  const { markAsRead } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [counts, setCounts] = useState({})

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
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      marginLeft: 12,
    },
    cancelButton: {
      marginLeft: 12,
    },
    cancelText: {
      color: theme.primary,
      fontSize: 16,
    },
    filterTabs: {
      marginBottom: 16,
    },
    filterScrollView: {
      paddingHorizontal: 16,
    },
    filterTab: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 12,
      borderRadius: 16,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    activeFilterTab: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterTabText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    activeFilterTabText: {
      color: '#fff',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    recentSearches: {
      marginBottom: 24,
    },
    recentSearchItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.card,
      borderRadius: 8,
      marginBottom: 8,
    },
    recentSearchText: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      marginLeft: 12,
    },
    trendingTopics: {
      marginBottom: 24,
    },
    trendingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.card,
      borderRadius: 8,
      marginBottom: 8,
    },
    trendingText: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      marginLeft: 12,
    },
    trendingCount: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    searchResults: {
      flex: 1,
    },
    resultCount: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 16,
    },
    noResults: {
      textAlign: 'center',
      fontSize: 16,
      color: theme.textSecondary,
      marginTop: 40,
    },
    suggestion: {
      textAlign: 'center',
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 8,
      fontStyle: 'italic',
    },
  })

  useEffect(() => {
    // one-time screen view and load recent searches
    screenView('Search')
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem('search.recent')
        if (raw) setRecentSearches(JSON.parse(raw))
      } catch {}
    })()
  }, [])

  useEffect(() => {
    let active = true
    const run = async () => {
      const q = searchQuery.trim()
      if (!q) {
        setSearchResults([])
        setIsSearching(false)
        return
      }
      setIsSearching(true)
      try {
        const remote = await searchArticlesApi(q, selectedCategory).catch(() => [])
        if (!active) return
        if (remote && remote.length) {
          setSearchResults(remote)
        } else {
          const local = localSearch(q)
          const filtered =
            selectedCategory === 'all'
              ? local
              : local.filter((a) => a.category === selectedCategory)
          setSearchResults(filtered)
        }
      } finally {
        if (active) setIsSearching(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [searchQuery, selectedCategory])

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

  const handleRecentSearch = (query) => {
    setSearchQuery(query)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  useEffect(() => {
    // save recent searches when query finalizes (simple heuristic)
    const t = setTimeout(async () => {
      const q = searchQuery.trim()
      if (!q) return
      try {
        const next = [
          q,
          ...recentSearches.filter((s) => s.toLowerCase() !== q.toLowerCase()),
        ].slice(0, 8)
        setRecentSearches(next)
        await AsyncStorage.setItem('search.recent', JSON.stringify(next))
      } catch {}
    }, 600)
    return () => clearTimeout(t)
  }, [searchQuery])

  const filterCategories = React.useMemo(
    () => [
      { id: 'all', name: 'All', slug: 'all' },
      ...Object.entries(CATEGORIES).map(([slug, meta]) => ({ id: slug, name: meta.name, slug })),
    ],
    []
  )

  // Load top articles once to derive trending categories
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const items = await getTopArticles().catch(() => [])
        if (!active || !Array.isArray(items)) return
        const map = {}
        for (const it of items) {
          const slug = String(it?.category || '')
            .toLowerCase()
            .trim()
          if (!slug) continue
          map[slug] = (map[slug] || 0) + 1
        }
        setCounts(map)
      } finally {
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const trendingCategories = React.useMemo(() => {
    const entries = Object.entries(counts)
      .filter(([slug]) => slug !== 'top')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    return entries.map(([slug, count]) => ({
      title: CATEGORIES[slug]?.name || slug,
      count,
    }))
  }, [counts])

  const renderFilterTab = (category) => (
    <TouchableOpacity
      key={category.slug}
      style={[styles.filterTab, selectedCategory === category.slug && styles.activeFilterTab]}
      onPress={() => setSelectedCategory(category.slug)}
    >
      <Text
        style={[
          styles.filterTabText,
          selectedCategory === category.slug && styles.activeFilterTabText,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search news, topics, authors..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        {searchQuery.length > 0 && (
          <View style={styles.filterTabs}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollView}
            >
              {filterCategories.map(renderFilterTab)}
            </ScrollView>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchQuery.length === 0 ? (
          // Default Search Screen
          <>
            {/* Recent Searches */}
            <View style={styles.recentSearches}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => handleRecentSearch(search)}
                >
                  <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
                  <Text style={styles.recentSearchText}>{search}</Text>
                  <Ionicons name="arrow-up-outline" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Trending Categories (live) */}
            {trendingCategories.length > 0 && (
              <View style={styles.trendingTopics}>
                <Text style={styles.sectionTitle}>Trending Categories</Text>
                {trendingCategories.map((topic, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.trendingItem}
                    onPress={() => handleRecentSearch(topic.title)}
                  >
                    <Ionicons name="trending-up" size={20} color={theme.primary} />
                    <Text style={styles.trendingText}>{topic.title}</Text>
                    <Text style={styles.trendingCount}>
                      {topic.count} article{topic.count !== 1 ? 's' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        ) : (
          // Search Results
          <View style={styles.searchResults}>
            {isSearching ? (
              <Text style={styles.resultCount}>Searching...</Text>
            ) : (
              <>
                <Text style={styles.resultCount}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  {selectedCategory !== 'all' &&
                    ` in ${filterCategories.find((cat) => cat.slug === selectedCategory)?.name}`}
                </Text>

                {searchResults.length > 0 ? (
                  searchResults.map((article) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      onPress={() => handleArticlePress(article)}
                      size="large"
                    />
                  ))
                ) : (
                  <>
                    <Text style={styles.noResults}>No articles found for "{searchQuery}"</Text>
                    <Text style={styles.suggestion}>
                      Try searching for different keywords or check spelling
                    </Text>
                  </>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
