import React from 'react'
import { View, StyleSheet } from 'react-native'

export const CardSkeleton = ({ height = 200 }: { height?: number }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.block, { height }]} />
      <View style={styles.content}>
        <View style={[styles.line, { width: '30%' }]} />
        <View style={[styles.line, { width: '90%' }]} />
        <View style={[styles.line, { width: '80%' }]} />
      </View>
    </View>
  )
}

export const ListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  block: {
    backgroundColor: '#e5e7eb',
    width: '100%',
  },
  content: {
    padding: 16,
  },
  line: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 10,
  },
})

export default ListSkeleton
