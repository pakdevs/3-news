import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const lightTheme = {
  primary: '#2563eb',
  secondary: '#64748b',
  background: '#ffffff',
  surface: '#f8fafc',
  card: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  accent: '#3b82f6',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  breaking: '#dc2626',
}

export const darkTheme = {
  primary: '#3b82f6',
  secondary: '#94a3b8',
  background: '#0f172a',
  surface: '#1e293b',
  card: '#334155',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#475569',
  accent: '#60a5fa',
  error: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',
  breaking: '#f87171',
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)
  const [theme, setTheme] = useState(lightTheme)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTheme()
  }, [])

  useEffect(() => {
    setTheme(isDark ? darkTheme : lightTheme)
  }, [isDark])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme')
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark')
      }
    } catch (error) {
      console.error('Error loading theme:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark
      setIsDark(newTheme)
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light')
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }

  const value = {
    theme,
    isDark,
    toggleTheme,
    isLoading,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
