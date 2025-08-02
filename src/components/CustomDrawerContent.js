import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { categories } from '../data/newsData'

export default function CustomDrawerContent(props) {
  const { theme, toggleTheme, isDark } = useTheme()
  const { user, logout } = useApp()

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
    props.navigation.navigate('MainStack', {
      screen: 'Category',
      params: {
        categorySlug: category.slug,
        categoryName: category.name,
      },
    })
  }

  const handleSignIn = () => {
    props.navigation.navigate('MainStack', {
      screen: 'Login',
    })
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
        <DrawerItem
          label="Home"
          icon={({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />}
          onPress={() => props.navigation.navigate('MainStack')}
          labelStyle={{ color: theme.text }}
          activeTintColor={theme.primary}
          inactiveTintColor={theme.textSecondary}
        />

        <DrawerItem
          label="Search"
          icon={({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />}
          onPress={() => props.navigation.navigate('MainStack', { screen: 'Search' })}
          labelStyle={{ color: theme.text }}
          activeTintColor={theme.primary}
          inactiveTintColor={theme.textSecondary}
        />

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
          <DrawerItem
            label="Settings"
            icon={({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            )}
            onPress={() => props.navigation.navigate('Settings')}
            labelStyle={{ color: theme.text }}
            activeTintColor={theme.primary}
            inactiveTintColor={theme.textSecondary}
          />

          <DrawerItem
            label="About"
            icon={({ color, size }) => (
              <Ionicons name="information-circle-outline" size={size} color={color} />
            )}
            onPress={() => props.navigation.navigate('About')}
            labelStyle={{ color: theme.text }}
            activeTintColor={theme.primary}
            inactiveTintColor={theme.textSecondary}
          />

          {user && (
            <DrawerItem
              label="Sign Out"
              icon={({ color, size }) => (
                <Ionicons name="log-out-outline" size={size} color={color} />
              )}
              onPress={handleLogout}
              labelStyle={{ color: theme.text }}
              activeTintColor={theme.primary}
              inactiveTintColor={theme.textSecondary}
            />
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
