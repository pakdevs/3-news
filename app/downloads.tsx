import DownloadsScreen from '../src/screens/DownloadsScreen.js'
import { useRouter } from 'expo-router'

export default function DownloadsPage() {
  const router = useRouter()

  const navigationCompat = {
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

  return <DownloadsScreen navigation={navigationCompat} />
}
