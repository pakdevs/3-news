import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'

export default function ProfileScreen({ navigation }) {
  const { theme } = useTheme()
  const { user, logout, bookmarks, readLater, followedTopics, followedAuthors, readArticles } =
    useApp()

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
    settingsButton: {
      padding: 4,
    },
    content: {
      flex: 1,
    },
    profileSection: {
      backgroundColor: theme.card,
      padding: 20,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 16,
    },
    defaultAvatar: {
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 16,
    },
    signInButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 8,
    },
    signInButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    editProfileButton: {
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 8,
    },
    editProfileText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '600',
    },
    statsSection: {
      backgroundColor: theme.card,
      marginTop: 1,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    statLabel: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },
    menuSection: {
      marginTop: 1,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    menuIcon: {
      marginRight: 16,
    },
    menuText: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
    },
    menuChevron: {
      marginLeft: 8,
    },
    preferencesSection: {
      marginTop: 20,
      backgroundColor: theme.card,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    logoutButton: {
      backgroundColor: theme.error,
      marginHorizontal: 20,
      marginVertical: 20,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  })

  const handleSignIn = () => {
    navigation.navigate('Login')
  }

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: logout,
      },
    ])
  }

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: () => Alert.alert('Coming Soon', 'Edit profile feature coming soon!'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notification Settings',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings coming soon!'),
    },
    {
      icon: 'heart-outline',
      title: 'Following',
      subtitle: `${followedTopics.length + followedAuthors.length} topics & authors`,
      onPress: () => Alert.alert('Coming Soon', 'Following management coming soon!'),
    },
    {
      icon: 'download-outline',
      title: 'Offline Reading',
      onPress: () => Alert.alert('Coming Soon', 'Offline reading settings coming soon!'),
    },
    {
      icon: 'shield-outline',
      title: 'Privacy & Security',
      onPress: () => Alert.alert('Coming Soon', 'Privacy settings coming soon!'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => Alert.alert('Coming Soon', 'Help & support coming soon!'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      onPress: () => navigation.navigate('About'),
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color={theme.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Profile</Text>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {user ? (
            <>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.defaultAvatar]}>
                  <Ionicons name="person" size={40} color="#fff" />
                </View>
              )}
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={[styles.avatar, styles.defaultAvatar]}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
              <Text style={styles.userName}>Welcome to NewsApp</Text>
              <Text style={styles.userEmail}>Sign in to personalize your experience</Text>
              <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{readArticles.length}</Text>
              <Text style={styles.statLabel}>Articles Read</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{bookmarks.length}</Text>
              <Text style={styles.statLabel}>Bookmarked</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{followedTopics.length}</Text>
              <Text style={styles.statLabel}>Topics</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{followedAuthors.length}</Text>
              <Text style={styles.statLabel}>Authors</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <Ionicons
                name={item.icon}
                size={24}
                color={theme.textSecondary}
                style={styles.menuIcon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.menuText}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={[styles.menuText, { fontSize: 14, color: theme.textSecondary }]}>
                    {item.subtitle}
                  </Text>
                )}
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textSecondary}
                style={styles.menuChevron}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        {user && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
