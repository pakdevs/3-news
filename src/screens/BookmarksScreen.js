import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import NewsCard from '../components/NewsCard'

export default function BookmarksScreen({ navigation }) {
  const { theme } = useTheme()
  const { bookmarks, readLater, markAsRead, removeBookmark, removeFromReadLater } = useApp()
  const [activeTab, setActiveTab] = useState('bookmarks')

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
    menuButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    moreButton: {
      padding: 4,
    },
    tabs: {
      flexDirection: 'row',
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: theme.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    activeTabText: {
      color: theme.primary,
    },
    content: {
      flex: 1,
      padding: 16,
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
      marginBottom: 24,
    },
    exploreButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    exploreButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    articleCount: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 16,
    },
  })

  const handleArticlePress = (article) => {
    markAsRead(article.id)
    navigation.navigate('ArticleDetail', { article })
  }

  const handleMoreOptions = () => {
    const options = ['Clear All Bookmarks', 'Clear All Read Later', 'Export Bookmarks', 'Cancel']

    Alert.alert('More Options', 'Choose an action', [
      {
        text: 'Clear All Bookmarks',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Clear Bookmarks', 'Are you sure you want to remove all bookmarks?', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Clear',
              style: 'destructive',
              onPress: () => {
                bookmarks.forEach((article) => removeBookmark(article.id))
              },
            },
          ])
        },
      },
      {
        text: 'Clear All Read Later',
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            'Clear Read Later',
            'Are you sure you want to remove all read later articles?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Clear',
                style: 'destructive',
                onPress: () => {
                  readLater.forEach((article) => removeFromReadLater(article.id))
                },
              },
            ]
          )
        },
      },
      {
        text: 'Export Bookmarks',
        onPress: async () => {
          try {
            const payload = JSON.stringify(
              bookmarks.map((a) => ({
                id: String(a.id),
                title: a.title,
                url: a.url || a.imageUrl,
              })),
              null,
              2
            )
            await Share.share({
              title: 'Bookmarks.json',
              message: payload,
            })
          } catch (e) {
            Alert.alert('Export Failed', 'Unable to export bookmarks at this time.')
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  const renderEmptyState = (type) => {
    const isBookmarks = type === 'bookmarks'
    return (
      <View style={styles.emptyState}>
        <Ionicons
          name={isBookmarks ? 'bookmark-outline' : 'time-outline'}
          size={64}
          color={theme.textSecondary}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyTitle}>
          {isBookmarks ? 'No Bookmarks Yet' : 'No Articles Saved for Later'}
        </Text>
        <Text style={styles.emptyDescription}>
          {isBookmarks
            ? 'Start bookmarking articles you want to read again. Tap the bookmark icon on any article to save it here.'
            : 'Save articles to read later when you have more time. Use the "Read Later" option in the article menu.'}
        </Text>
        <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.push('/')}>
          <Text style={styles.exploreButtonText}>Explore News</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const currentArticles = activeTab === 'bookmarks' ? bookmarks : readLater

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color={theme.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Saved</Text>

          <TouchableOpacity style={styles.moreButton} onPress={handleMoreOptions}>
            <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'bookmarks' && styles.activeTab]}
            onPress={() => setActiveTab('bookmarks')}
          >
            <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.activeTabText]}>
              Bookmarks ({bookmarks.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'readLater' && styles.activeTab]}
            onPress={() => setActiveTab('readLater')}
          >
            <Text style={[styles.tabText, activeTab === 'readLater' && styles.activeTabText]}>
              Read Later ({readLater.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {currentArticles.length === 0 ? (
        renderEmptyState(activeTab)
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.articleCount}>
            {currentArticles.length} article{currentArticles.length !== 1 ? 's' : ''} saved
          </Text>

          {currentArticles.map((article) => (
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
