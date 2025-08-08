import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { categories } from '../data/newsData'
import { useRouter } from 'expo-router'
import { DrawerContentScrollView } from '@react-navigation/drawer'

export default function CustomDrawerContent(props) {
  const { theme, toggleTheme, isDark } = useTheme()
  const { user, logout, offlineArticles } = useApp()
  const router = useRouter()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.card,
    },
    header: {
      padding: 20,
      backgroundColor: theme.primary,
      marginBottom: 10,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    userName: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    userEmail: {
      color: '#fff',
      opacity: 0.8,
      fontSize: 14,
    },
    signInButton: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    signInText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    section: {
      marginVertical: 10,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.textSecondary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      textTransform: 'uppercase',
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    categoryText: {
      marginLeft: 15,
      fontSize: 16,
      color: theme.text,
    },
    badge: {
      marginLeft: 'auto',
      backgroundColor: theme.primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      paddingHorizontal: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    themeText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 15,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 10,
    },
  })

  const navigateToCategory = (category) => {
    router.push(`/category/${category.slug}`)
  }

  const handleSignIn = () => {
    router.push('/login')
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {user ? (
          <View style={styles.userInfo}>
            <Image
              source={{
                uri:
                  user.avatar ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>

      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
        {/* Main Navigation */}
        <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="home-outline" size={24} color={theme.textSecondary} />
          <Text style={styles.categoryText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={24} color={theme.textSecondary} />
          <Text style={styles.categoryText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/downloads')}>
          <Ionicons name="download-outline" size={24} color={theme.textSecondary} />
          <Text style={styles.categoryText}>Downloads</Text>
          {!!(offlineArticles && offlineArticles.length) && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {offlineArticles.length > 99 ? '99+' : String(offlineArticles.length)}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => navigateToCategory(category)}
            >
              <Ionicons
                name={getCategoryIcon(category.slug)}
                size={24}
                color={theme.textSecondary}
              />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme Toggle */}
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={theme.textSecondary} />
            <Text style={styles.themeText}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
          </View>
          <Ionicons name="toggle" size={24} color={isDark ? theme.primary : theme.textSecondary} />
        </TouchableOpacity>

        {/* Footer Items */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={24} color={theme.textSecondary} />
            <Text style={styles.categoryText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/about')}>
            <Ionicons name="information-circle-outline" size={24} color={theme.textSecondary} />
            <Text style={styles.categoryText}>About</Text>
          </TouchableOpacity>

          {user && (
            <TouchableOpacity style={styles.categoryItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color={theme.textSecondary} />
              <Text style={styles.categoryText}>Sign Out</Text>
            </TouchableOpacity>
          )}
        </View>
      </DrawerContentScrollView>
    </View>
  )
}

function getCategoryIcon(slug) {
  const icons = {
    top: 'star-outline',
    technology: 'laptop-outline',
    business: 'briefcase-outline',
    sports: 'football-outline',
    politics: 'library-outline',
    health: 'medical-outline',
    science: 'flask-outline',
    entertainment: 'musical-notes-outline',
  }
  return icons[slug] || 'document-outline'
}
