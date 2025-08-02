import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { categories, getArticlesByCategory } from '../data/newsData'

const { width } = Dimensions.get('window')

export default function SectionsScreen({ navigation }) {
  const { theme } = useTheme()
  const { isFollowingTopic, followTopic, unfollowTopic } = useApp()

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
    },
    menuButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    searchButton: {
      padding: 4,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: (width - 48) / 2,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      position: 'relative',
    },
    categoryIcon: {
      marginBottom: 12,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    categoryCount: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 12,
    },
    followButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
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
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
    },
    followingText: {
      color: '#fff',
    },
    notFollowingText: {
      color: theme.textSecondary,
    },
    trendsSection: {
      marginTop: 24,
    },
    trendItem: {
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    trendInfo: {
      flex: 1,
    },
    trendTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    trendCount: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    trendIcon: {
      marginLeft: 12,
    },
  })

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

  const getCategoryColor = (slug) => {
    const colors = {
      top: '#fbbf24',
      technology: '#3b82f6',
      business: '#10b981',
      sports: '#f59e0b',
      politics: '#6366f1',
      health: '#ef4444',
      science: '#8b5cf6',
      entertainment: '#ec4899',
    }
    return colors[slug] || theme.primary
  }

  const handleCategoryPress = (category) => {
    navigation.navigate('Category', {
      categorySlug: category.slug,
      categoryName: category.name,
    })
  }

  const handleFollowToggle = (category) => {
    if (isFollowingTopic(category.slug)) {
      unfollowTopic(category.slug)
    } else {
      followTopic(category)
    }
  }

  const trendingTopics = [
    { title: 'Artificial Intelligence', count: '2.5k articles' },
    { title: 'Climate Change', count: '1.8k articles' },
    { title: 'Space Exploration', count: '1.2k articles' },
    { title: 'Cryptocurrency', count: '956 articles' },
    { title: 'Healthcare', count: '834 articles' },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color={theme.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Sections</Text>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>

        <View style={styles.grid}>
          {categories.map((category) => {
            const articleCount = getArticlesByCategory(category.slug).length
            const isFollowing = isFollowingTopic(category.slug)
            const categoryColor = getCategoryColor(category.slug)

            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={getCategoryIcon(category.slug)} size={32} color={categoryColor} />
                </View>

                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>
                  {articleCount} article{articleCount !== 1 ? 's' : ''}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.followButton,
                    isFollowing ? styles.followingButton : styles.notFollowingButton,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation()
                    handleFollowToggle(category)
                  }}
                >
                  <Ionicons
                    name={isFollowing ? 'checkmark' : 'add'}
                    size={14}
                    color={isFollowing ? '#fff' : theme.textSecondary}
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
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.trendsSection}>
          <Text style={styles.sectionTitle}>Trending Topics</Text>
          {trendingTopics.map((trend, index) => (
            <TouchableOpacity key={index} style={styles.trendItem}>
              <View style={styles.trendInfo}>
                <Text style={styles.trendTitle}>{trend.title}</Text>
                <Text style={styles.trendCount}>{trend.count}</Text>
              </View>
              <Ionicons
                name="trending-up"
                size={20}
                color={theme.primary}
                style={styles.trendIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
