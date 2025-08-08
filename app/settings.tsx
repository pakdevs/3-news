import SettingsScreen from '../src/screens/SettingsScreen'
import { useRouter } from 'expo-router'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'

export default function SettingsPage() {
  const router = useRouter()
  const navigation = useNavigation()

  const navigationCompat = {
    navigate: (route: string, params?: any) => {
      if (route === 'ArticleDetail') {
        router.push(`/article/${params?.article?.id}`)
      } else if (route === 'Search') {
        router.push('/search')
      } else if (route === 'Category') {
        router.push(`/category/${params?.categorySlug}`)
      } else {
        router.push(`/${route.toLowerCase()}`)
      }
    },
    goBack: () => router.back(),
    push: (route: string) => router.push(route),
    openDrawer: () => navigation.dispatch(DrawerActions.openDrawer()),
    closeDrawer: () => navigation.dispatch(DrawerActions.closeDrawer()),
    toggleDrawer: () => navigation.dispatch(DrawerActions.toggleDrawer()),
  }

  return <SettingsScreen navigation={navigationCompat} />
}
