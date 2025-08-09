import * as React from 'react'
import { useRouter } from 'expo-router'
import OnboardingScreen from '../src/screens/OnboardingScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Onboarding() {
  const router = useRouter()
  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true')
    } catch {}
    router.replace('/(tabs)')
  }
  return <OnboardingScreen onComplete={handleComplete} />
}
