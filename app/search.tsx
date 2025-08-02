import SearchScreen from '../src/screens/SearchScreen'
import { useRouter } from 'expo-router'

export default function SearchPage() {
  const router = useRouter()

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

  return <SearchScreen navigation={navigation} />
}
