import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'

const { width, height } = Dimensions.get('window')

const onboardingData = [
  {
    id: 1,
    title: 'Stay Informed',
    description: 'Get the latest news from around the world, delivered to your fingertips.',
    icon: 'newspaper-outline',
    color: '#3b82f6',
  },
  {
    id: 2,
    title: 'Personalize Your Feed',
    description: 'Follow topics and authors that matter to you for a customized experience.',
    icon: 'heart-outline',
    color: '#ef4444',
  },
  {
    id: 3,
    title: 'Read Anywhere',
    description: 'Save articles for offline reading and never miss important stories.',
    icon: 'download-outline',
    color: '#10b981',
  },
]

export default function OnboardingScreen({ onComplete }) {
  const { theme } = useTheme()
  const [currentStep, setCurrentStep] = useState(0)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    description: {
      fontSize: 18,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 26,
      marginBottom: 40,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 40,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 6,
      backgroundColor: theme.border,
    },
    activeDot: {
      backgroundColor: theme.primary,
    },
    navigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingBottom: 40,
    },
    skipButton: {
      padding: 12,
    },
    skipText: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    nextButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    getStartedButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
  })

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const currentData = onboardingData[currentStep]
  const isLastStep = currentStep === onboardingData.length - 1

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={currentData.icon} size={60} color={currentData.color} />
        </View>

        <Text style={styles.title}>{currentData.title}</Text>
        <Text style={styles.description}>{currentData.description}</Text>

        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View key={index} style={[styles.dot, index === currentStep && styles.activeDot]} />
          ))}
        </View>
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={isLastStep ? styles.getStartedButton : styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>{isLastStep ? 'Get Started' : 'Next'}</Text>
          <Ionicons name={isLastStep ? 'checkmark' : 'arrow-forward'} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
