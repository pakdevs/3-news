import AboutScreen from '../src/screens/AboutScreen'
import { useRouter } from 'expo-router'

export default function AboutPage() {
  const router = useRouter()

  const navigation = {
    navigate: (route: string) => {
      router.push(`/${route.toLowerCase()}`)
    },
    goBack: () => router.back(),
    push: (route: string) => router.push(route),
  }

  return <AboutScreen navigation={navigation} />
}
