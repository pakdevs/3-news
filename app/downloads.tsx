import DownloadsScreen from '../src/screens/DownloadsScreen.js'
import { useRouter } from 'expo-router'

export default function DownloadsPage() {
  const router = useRouter()

  const navigationCompat = {
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

  return <DownloadsScreen navigation={navigationCompat} />
}
