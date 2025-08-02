import LoginScreen from '../src/screens/LoginScreen'
import { useRouter } from 'expo-router'

export default function LoginPage() {
  const router = useRouter()

  const navigation = {
    navigate: (route: string) => {
      if (route === 'Home') {
        router.replace('/(tabs)')
      } else {
        router.push(`/${route.toLowerCase()}`)
      }
    },
    goBack: () => router.back(),
    push: (route: string) => router.push(route),
  }

  return <LoginScreen navigation={navigation} />
}
