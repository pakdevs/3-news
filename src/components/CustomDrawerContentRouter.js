import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../utils/config'
import { useRouter } from 'expo-router'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { getRegionTop, getRegionCategory } from '../utils/api'

export default function CustomDrawerContent(props) {
  const { theme, toggleTheme, isDark } = useTheme()
  const { user, logout, offlineArticles, region, setRegion } = useApp()
  const router = useRouter()
  const [visibleCategories, setVisibleCategories] = useState(Object.entries(CATEGORIES))
  const [catCounts, setCatCounts] = useState({})

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
      marginVertical: 6,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.textSecondary,
      paddingHorizontal: 20,
      paddingVertical: 4,
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
    editionRow: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingBottom: 2,
      marginTop: 2,
    },
    editionButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      marginRight: 8,
      flexDirection: 'row',
      alignItems: 'center',
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
    // Removed flag icon styles (no longer used for Pakistan button)
  })

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        // Initial counts from top stories (fast)
        const items = await getRegionTop(region).catch(() => [])
        if (!active) return
        const counts = {}
        for (const a of items) {
          const slug = String(a?.category || '')
            .toLowerCase()
            .trim()
          if (!slug) continue
          counts[slug] = (counts[slug] || 0) + 1
        }
        setVisibleCategories(Object.entries(CATEGORIES))
        setCatCounts(counts)

        // Refine counts by fetching each category endpoint (except top)
        const categorySlugs = Object.keys(CATEGORIES).filter((s) => s !== 'top')
        const results = await Promise.all(
          categorySlugs.map(async (slug) => {
            try {
              const list = await getRegionCategory(region, slug).catch(() => [])
              return [slug, Array.isArray(list) ? list.length : 0]
            } catch {
              return [slug, 0]
            }
          })
        )
        if (!active) return
        const refined = { ...counts }
        for (const [slug, len] of results) {
          if (len) refined[slug] = len
        }
        // Recompute top total as sum of refined category counts (excluding top itself)
        const total = Object.entries(refined)
          .filter(([s]) => s !== 'top')
          .reduce((acc, [, v]) => acc + v, 0)
        refined.top = total || refined.top || 0
        setCatCounts(refined)
      } catch {
        // ignore
      }
    })()
    return () => {
      active = false
    }
  }, [region])

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
        {/* Region Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Edition</Text>
          <View style={styles.editionRow}>
            {[
              { key: 'pk', label: 'Pakistan' },
              { key: 'world', label: 'World' },
            ].map((t) => {
              const active = region === t.key
              return (
                <TouchableOpacity
                  key={t.key}
                  onPress={() => setRegion(t.key)}
                  style={[styles.editionButton, active && styles.editionButtonActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  {t.key === 'world' && (
                    <Ionicons
                      name="globe-outline"
                      size={16}
                      style={{ marginRight: 6 }}
                      color={active ? '#fff' : theme.textSecondary}
                    />
                  )}
                  <Text
                    style={[styles.editionButtonText, active && styles.editionButtonTextActive]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
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

        {/* Categories Section (region-aware) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          {visibleCategories.map(([slug, meta]) => (
            <TouchableOpacity
              key={slug}
              style={styles.categoryItem}
              onPress={() => navigateToCategory({ slug, name: meta.name })}
            >
              <Ionicons
                name={getCategoryIcon(slug, meta?.icon)}
                size={24}
                color={theme.textSecondary}
              />
              <Text style={styles.categoryText}>{meta.name}</Text>
              {(() => {
                const total = Object.values(catCounts).reduce((a, b) => a + b, 0)
                const count = slug === 'top' ? total : catCounts[slug] || 0
                if (count > 0) {
                  return (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{String(count)}</Text>
                    </View>
                  )
                }
                return null
              })()}
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

function getCategoryIcon(slug, preferredIcon) {
  // Prefer configured icon if provided; try to use outline variant for drawer
  if (preferredIcon && typeof preferredIcon === 'string') {
    const outline = `${preferredIcon}-outline`
    return outline
  }
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
