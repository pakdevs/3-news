import { useLocalSearchParams, useRouter } from 'expo-router'
import ArticleDetailScreen from '../../src/screens/ArticleDetailScreen'
import { newsArticles } from '../../src/data/newsData'

export default function ArticlePage() {
  const { id } = useLocalSearchParams()
  const router = useRouter()

  // Find the article by ID
  const articleId = Array.isArray(id) ? id[0] : id
  const article = newsArticles.find((a) => a.id === articleId)

  const navigation = {
    navigate: (route: string, params?: any) => {
      router.push(`/${route.toLowerCase()}`)
    },
    goBack: () => router.back(),
    push: (route: string) => router.push(route),
  }

  const route = {
    params: { article },
  }

  if (!article) {
    // Article not found, redirect to home
    router.replace('/(tabs)')
    return null
  }

  return <ArticleDetailScreen navigation={navigation} route={route} />
}
