import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import NewsCard from '../components/NewsCard'

export default function DownloadsScreen({ navigation }) {
  const { theme } = useTheme()
  const { offlineArticles } = useApp()

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      backgroundColor: theme.card,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text },
    content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
    empty: { color: theme.textSecondary, textAlign: 'center', marginTop: 40 },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: theme.primary }}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Downloads</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {offlineArticles.length === 0 ? (
          <Text style={styles.empty}>No offline articles saved yet.</Text>
        ) : (
          offlineArticles.map((a) => (
            <NewsCard
              key={a.id}
              article={a}
              onPress={() => navigation.navigate('ArticleDetail', { article: a })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
