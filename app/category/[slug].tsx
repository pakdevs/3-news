import { useLocalSearchParams, useRouter } from 'expo-router'
import CategoryScreen from '../../src/screens/CategoryScreen'
import { CATEGORIES } from '../../src/utils/config'

export default function CategoryPage() {
  const { slug } = useLocalSearchParams()
  const router = useRouter()

  // Find the category by slug
  const slugValue = Array.isArray(slug) ? slug[0] : slug
  const categoryMeta = CATEGORIES[slugValue as string]

  const navigation = {
    navigate: (route: string, params?: any) => {
      if (route === 'ArticleDetail') {
        const id = params?.article?.id
        const payload = params?.article ? encodeURIComponent(JSON.stringify(params.article)) : ''
        router.push({ pathname: `/article/${id}`, params: payload ? { article: payload } : {} })
      } else {
        router.push(`/${route.toLowerCase()}`)
      }
    },
    goBack: () => router.back(),
    push: (route: string) => router.push(route),
  }

  const route = {
    params: {
      categorySlug: slugValue,
      categoryName: categoryMeta?.name || 'Category',
    },
  }

  return <CategoryScreen navigation={navigation} route={route} />
}
