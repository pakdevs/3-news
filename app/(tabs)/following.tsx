import * as React from 'react'
import HomeScreen from '../../src/screens/HomeScreen'
import { useRouter } from 'expo-router'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'

// Following tab renders HomeScreen but preselects the "For You" tab using
// the existing navigation contract. We simulate a tiny route to pick the tab.
export default function FollowingPage() {
  const router = useRouter()
  const navigation = useNavigation()

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

  // Delegate to HomeScreen; it already supports a "For You" tab based on state.
  // We don't have a direct prop to set it, so we navigate to Search/Sections as needed.
  return <HomeScreen navigation={navigationCompat} initialFeedTab="foryou" />
}
