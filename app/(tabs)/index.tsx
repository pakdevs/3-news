import HomeScreen from '../../src/screens/HomeScreen'
import { useRouter } from 'expo-router'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'

export default function HomePage() {
  const router = useRouter()
  const navigation = useNavigation()

  // Create a navigation-like object for compatibility
  const navigationCompat = {
    navigate: (route: string, params?: any) => {
      if (route === 'ArticleDetail') {
        const id = params?.article?.id
        const payload = params?.article ? encodeURIComponent(JSON.stringify(params.article)) : ''
        router.push({ pathname: `/article/${id}`, params: payload ? { article: payload } : {} })
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

  return <HomeScreen navigation={navigationCompat} />
}
