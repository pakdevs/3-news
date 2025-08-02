import { useLocalSearchParams, useRouter } from 'expo-router'
import CategoryScreen from '../../src/screens/CategoryScreen'
import { categories } from '../../src/data/newsData'

export default function CategoryPage() {
  const { slug } = useLocalSearchParams()
  const router = useRouter()

  // Find the category by slug
  const category = categories.find((c) => c.slug === slug)

  const navigation = {
    navigate: (route: string, params?: any) => {
      if (route === 'ArticleDetail') {
        router.push(`/article/${params?.article?.id}`)
      } else {
        router.push(`/${route.toLowerCase()}`)
      }
    },
    goBack: () => router.back(),
    push: (route: string) => router.push(route),
  }

  const route = {
    params: {
      categorySlug: slug,
      categoryName: category?.name || 'Category',
    },
  }

  return <CategoryScreen navigation={navigation} route={route} />
}
