// app/_layout.tsx
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '../src/context/ThemeContext'
import { AppProvider } from '../src/context/AppContext'
import { Slot } from 'expo-router' // <== CRUCIAL: renders nested layouts like (tabs)/_layout.tsx

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AppProvider>
            <Slot />
          </AppProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
