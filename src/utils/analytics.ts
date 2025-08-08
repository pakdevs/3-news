// Minimal analytics abstraction (no-op). Replace with real provider later.
export type AnalyticsEvent = {
  name: string
  params?: Record<string, any>
}

export const logEvent = (_event: AnalyticsEvent) => {
  // Intentionally no-op in this build
}

export const screenView = (screenName: string) =>
  logEvent({ name: 'screen_view', params: { screenName } })
