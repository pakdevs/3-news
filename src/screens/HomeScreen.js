import React, { useState } from 'react'
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
import { newsArticles, breakingNews, categories } from '../data/newsData'
import sanitizeArticle from '../utils/sanitizeArticle'

const { width } = Dimensions.get('window')

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme()
  const { markAsRead } = useApp()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('top')

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
    }, 1000)
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
    if (selectedCategory === 'top') {
      return newsArticles
    }
    return newsArticles.filter((article) => article.category === selectedCategory)
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

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Breaking News Section */}
        {breakingNews.length > 0 && (
          <View style={styles.breakingSection}>
            <View style={styles.breakingHeader}>
              <Ionicons name="flash" size={20} color={theme.breaking} />
              <Text style={styles.breakingTitle}>Breaking News</Text>
            </View>
            <FlatList
              data={breakingNews}
              renderItem={renderBreakingNewsItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {/* Main News Section */}
        <View style={styles.newsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'top'
              ? 'Top Stories'
              : categories.find((cat) => cat.slug === selectedCategory)?.name || 'News'}
          </Text>

          {getFilteredArticles().map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onPress={() => handleArticlePress(article)}
              size="large"
            />
          ))}

          {getFilteredArticles().length === 0 && (
            <Text style={styles.loadingText}>No articles found in this category.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
