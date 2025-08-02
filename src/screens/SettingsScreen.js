import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'

export default function SettingsScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme()
  const { user } = useApp()

  const [notifications, setNotifications] = useState({
    breaking: true,
    daily: true,
    followed: true,
    recommendations: false,
  })

  const [preferences, setPreferences] = useState({
    autoDownload: false,
    dataSync: true,
    analytics: true,
  })

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
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: 4,
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    content: {
      flex: 1,
    },
    section: {
      backgroundColor: theme.card,
      marginTop: 20,
    },
    sectionHeader: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    sectionDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      marginRight: 16,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 2,
    },
    settingValue: {
      fontSize: 14,
      color: theme.primary,
      marginRight: 8,
    },
    arrow: {
      marginLeft: 8,
    },
    switchContainer: {
      marginLeft: 'auto',
    },
    accountSection: {
      backgroundColor: theme.card,
      marginTop: 1,
    },
    accountInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    accountDetails: {
      flex: 1,
    },
    accountName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    accountEmail: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 2,
    },
    dangerSection: {
      backgroundColor: theme.card,
      marginTop: 20,
      marginBottom: 20,
    },
    dangerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    dangerText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.error,
      marginLeft: 16,
    },
    versionInfo: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    versionText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
  })

  const handleNotificationChange = (type, value) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const handlePreferenceChange = (type, value) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'This will remove all cached articles and images. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          // Implement cache clearing
          Alert.alert('Success', 'Cache cleared successfully')
        },
      },
    ])
  }

  const handleResetSettings = () => {
    Alert.alert('Reset Settings', 'This will reset all settings to default values. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          setNotifications({
            breaking: true,
            daily: true,
            followed: true,
            recommendations: false,
          })
          setPreferences({
            autoDownload: false,
            dataSync: true,
            analytics: true,
          })
          Alert.alert('Success', 'Settings reset to defaults')
        },
      },
    ])
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Coming Soon', 'Account deletion feature coming soon')
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        {user && (
          <View style={styles.accountSection}>
            <View style={styles.accountInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>{user.name}</Text>
                <Text style={styles.accountEmail}>{user.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </View>
          </View>
        )}

        {/* Appearance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <Text style={styles.sectionDescription}>Customize how the app looks and feels</Text>
          </View>

          <View style={styles.settingItem}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={24}
              color={theme.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Switch between light and dark themes</Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={isDark ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <Text style={styles.sectionDescription}>
              Choose what notifications you want to receive
            </Text>
          </View>

          <View style={styles.settingItem}>
            <Ionicons
              name="flash"
              size={24}
              color={theme.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Breaking News</Text>
              <Text style={styles.settingDescription}>Get notified of important breaking news</Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={notifications.breaking}
                onValueChange={(value) => handleNotificationChange('breaking', value)}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={notifications.breaking ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <Ionicons
              name="newspaper"
              size={24}
              color={theme.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Daily Digest</Text>
              <Text style={styles.settingDescription}>
                Receive a summary of top stories each morning
              </Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={notifications.daily}
                onValueChange={(value) => handleNotificationChange('daily', value)}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={notifications.daily ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <Ionicons
              name="heart"
              size={24}
              color={theme.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Followed Topics</Text>
              <Text style={styles.settingDescription}>
                Get updates from topics and authors you follow
              </Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={notifications.followed}
                onValueChange={(value) => handleNotificationChange('followed', value)}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={notifications.followed ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={[styles.settingItem, styles.lastItem]}>
            <Ionicons
              name="bulb"
              size={24}
              color={theme.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Recommendations</Text>
              <Text style={styles.settingDescription}>Get personalized article suggestions</Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={notifications.recommendations}
                onValueChange={(value) => handleNotificationChange('recommendations', value)}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={notifications.recommendations ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Reading Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reading & Storage</Text>
            <Text style={styles.sectionDescription}>Manage offline content and data usage</Text>
          </View>

          <View style={styles.settingItem}>
            <Ionicons
              name="download"
              size={24}
              color={theme.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Auto Download</Text>
              <Text style={styles.settingDescription}>
                Automatically save articles for offline reading
              </Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={preferences.autoDownload}
                onValueChange={(value) => handlePreferenceChange('autoDownload', value)}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={preferences.autoDownload ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
            <Ionicons
              name="trash"
              size={24}
              color={theme.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Clear Cache</Text>
              <Text style={styles.settingDescription}>
                Free up storage space by clearing cached data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Privacy & Data</Text>
            <Text style={styles.sectionDescription}>Control your data and privacy settings</Text>
          </View>

          <View style={styles.settingItem}>
            <Ionicons
              name="analytics"
              size={24}
              color={theme.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Analytics</Text>
              <Text style={styles.settingDescription}>
                Help improve the app by sharing usage data
              </Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={preferences.analytics}
                onValueChange={(value) => handlePreferenceChange('analytics', value)}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={preferences.analytics ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <TouchableOpacity style={[styles.settingItem, styles.lastItem]}>
            <Ionicons
              name="shield"
              size={24}
              color={theme.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>Read our privacy policy and terms</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Support</Text>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons
              name="help-circle"
              size={24}
              color={theme.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help Center</Text>
              <Text style={styles.settingDescription}>
                Get help and find answers to common questions
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons
              name="mail"
              size={24}
              color={theme.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Contact Us</Text>
              <Text style={styles.settingDescription}>Send feedback or report issues</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, styles.lastItem]}
            onPress={handleResetSettings}
          >
            <Ionicons
              name="refresh"
              size={24}
              color={theme.textSecondary}
              style={styles.settingIcon}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Reset Settings</Text>
              <Text style={styles.settingDescription}>Reset all settings to default values</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        {user && (
          <View style={styles.dangerSection}>
            <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
              <Ionicons name="warning" size={24} color={theme.error} />
              <Text style={styles.dangerText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>NewsApp v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
