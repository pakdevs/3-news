import SectionsScreen from '../../src/screens/SectionsScreen'
import { useRouter } from 'expo-router'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'

export default function SectionsPage() {
  const router = useRouter()
  const navigation = useNavigation()

  const navigationCompat = {
    navigate: (route: string, params?: any) => {
      if (route === 'Category') {
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

  return <SectionsScreen navigation={navigationCompat} />
}
