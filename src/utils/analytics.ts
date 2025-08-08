// Minimal analytics abstraction (no network). Replace with real provider later.
export type AnalyticsEvent = {
  name: string
  params?: Record<string, any>
}

export const logEvent = (event: AnalyticsEvent) => {
  // eslint-disable-next-line no-console
  if (__DEV__) console.log('[analytics]', event.name, event.params || {})
}

export const screenView = (screenName: string) =>
  logEvent({ name: 'screen_view', params: { screenName } })
