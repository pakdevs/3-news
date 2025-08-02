import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'

export default function AboutScreen({ navigation }) {
  const { theme } = useTheme()

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
      padding: 20,
    },
    logoSection: {
      alignItems: 'center',
      marginBottom: 32,
    },
    logo: {
      fontSize: 48,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 8,
    },
    appName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    version: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 16,
    },
    tagline: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
    },
    sectionText: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 24,
      textAlign: 'justify',
    },
    featureList: {
      marginTop: 12,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    featureIcon: {
      marginRight: 12,
    },
    featureText: {
      fontSize: 16,
      color: theme.text,
      flex: 1,
    },
    linkSection: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    linkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    lastLinkItem: {
      borderBottomWidth: 0,
    },
    linkIcon: {
      marginRight: 16,
    },
    linkText: {
      fontSize: 16,
      color: theme.text,
      flex: 1,
    },
    linkUrl: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 2,
    },
    teamSection: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    teamMember: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    lastTeamMember: {
      borderBottomWidth: 0,
    },
    memberAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    memberInfo: {
      flex: 1,
    },
    memberName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    memberRole: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    legalSection: {
      alignItems: 'center',
      marginTop: 20,
    },
    legalText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    legalLink: {
      color: theme.primary,
      textDecorationLine: 'underline',
    },
  })

  const handleLinkPress = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open the link')
    })
  }

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Error', 'Could not open email client')
    })
  }

  const features = [
    'Real-time breaking news alerts',
    'Personalized news feed',
    'Offline reading support',
    'Dark and light themes',
    'Bookmark and save articles',
    'Follow topics and authors',
    'Advanced search functionality',
    'Social sharing capabilities',
  ]

  const links = [
    {
      icon: 'globe-outline',
      title: 'Website',
      url: 'https://newsapp.com',
      description: 'Visit our website',
    },
    {
      icon: 'logo-twitter',
      title: 'Twitter',
      url: 'https://twitter.com/newsapp',
      description: '@newsapp',
    },
    {
      icon: 'logo-facebook',
      title: 'Facebook',
      url: 'https://facebook.com/newsapp',
      description: 'Follow us on Facebook',
    },
    {
      icon: 'logo-instagram',
      title: 'Instagram',
      url: 'https://instagram.com/newsapp',
      description: '@newsapp',
    },
  ]

  const teamMembers = [
    { name: 'Sarah Johnson', role: 'CEO & Founder' },
    { name: 'Michael Chen', role: 'CTO' },
    { name: 'Emily Rodriguez', role: 'Head of Product' },
    { name: 'David Park', role: 'Lead Developer' },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Text style={styles.logo}>📰</Text>
          <Text style={styles.appName}>NewsApp</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.tagline}>Stay informed, stay connected</Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About NewsApp</Text>
          <Text style={styles.sectionText}>
            NewsApp is your comprehensive source for breaking news, in-depth analysis, and
            personalized content from around the world. We believe that staying informed should be
            easy, enjoyable, and accessible to everyone.
          </Text>
          <Text style={styles.sectionText}>
            Our mission is to deliver high-quality journalism while providing a seamless reading
            experience across all your devices. Whether you're commuting, at home, or on the go,
            NewsApp keeps you connected to the stories that matter most.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featureList}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.primary}
                  style={styles.featureIcon}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <View style={styles.linkSection}>
            {links.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.linkItem, index === links.length - 1 && styles.lastLinkItem]}
                onPress={() => handleLinkPress(link.url)}
              >
                <Ionicons
                  name={link.icon}
                  size={24}
                  color={theme.textSecondary}
                  style={styles.linkIcon}
                />
                <View>
                  <Text style={styles.linkText}>{link.title}</Text>
                  <Text style={styles.linkUrl}>{link.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <View style={styles.teamSection}>
            {teamMembers.map((member, index) => (
              <View
                key={index}
                style={[
                  styles.teamMember,
                  index === teamMembers.length - 1 && styles.lastTeamMember,
                ]}
              >
                <View style={styles.memberAvatar}>
                  <Ionicons name="person" size={20} color="#fff" />
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Support</Text>
          <Text style={styles.sectionText}>
            Have questions, feedback, or need help? We'd love to hear from you!
          </Text>
          <Text style={styles.sectionText}>
            Email us at{' '}
            <Text style={styles.legalLink} onPress={() => handleEmailPress('support@newsapp.com')}>
              support@newsapp.com
            </Text>{' '}
            or reach out through our social media channels.
          </Text>
        </View>

        {/* Legal Section */}
        <View style={styles.legalSection}>
          <Text style={styles.legalText}>© 2025 NewsApp. All rights reserved.</Text>
          <Text style={styles.legalText}>
            <Text
              style={styles.legalLink}
              onPress={() => handleLinkPress('https://newsapp.com/privacy')}
            >
              Privacy Policy
            </Text>
            {' • '}
            <Text
              style={styles.legalLink}
              onPress={() => handleLinkPress('https://newsapp.com/terms')}
            >
              Terms of Service
            </Text>
          </Text>
          <Text style={styles.legalText}>Made with ❤️ for news enthusiasts worldwide</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
