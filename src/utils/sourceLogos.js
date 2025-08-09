// Mapping helper for news source logos.
// Currently uses a placeholder icon for known sources.
// Replace require paths with actual logo assets when available.

const PLACEHOLDER = require('../../assets/icon.png')

const LOGO_MAP = {
  'bbc news': PLACEHOLDER,
  cnn: PLACEHOLDER,
  'geo news': PLACEHOLDER,
  dawn: PLACEHOLDER,
  'al jazeera': PLACEHOLDER,
  reuters: PLACEHOLDER,
  ap: PLACEHOLDER,
  'associated press': PLACEHOLDER,
  'the guardian': PLACEHOLDER,
}

export function getSourceLogo(name) {
  if (!name) return null
  const key = String(name).trim().toLowerCase()
  return LOGO_MAP[key] || null
}

export default getSourceLogo
