import ProfileScreen from '../../src/screens/ProfileScreen'
import { useRouter } from 'expo-router'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'

export default function ProfilePage() {
  const router = useRouter()
  const navigation = useNavigation()

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
    openDrawer: () => navigation.dispatch(DrawerActions.openDrawer()),
    closeDrawer: () => navigation.dispatch(DrawerActions.closeDrawer()),
    toggleDrawer: () => navigation.dispatch(DrawerActions.toggleDrawer()),
  }

  return <ProfileScreen navigation={navigationCompat} />
}
