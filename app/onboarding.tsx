import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

export default function Onboarding() {
  const router = useRouter()
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Pick your interests (stub)</Text>
      <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
        <Text style={{ color: '#2563eb' }}>Continue</Text>
      </TouchableOpacity>
    </View>
  )
}
