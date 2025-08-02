import SettingsScreen from '../src/screens/SettingsScreen'
import { useRouter } from 'expo-router'

export default function SettingsPage() {
  const router = useRouter()

  const navigation = {
    navigate: (route: string) => {
      router.push(`/${route.toLowerCase()}`)
    },
    goBack: () => router.back(),
    push: (route: string) => router.push(route),
  }

  return <SettingsScreen navigation={navigation} />
}
