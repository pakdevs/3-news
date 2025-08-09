// Centralized API client with retries, timeout, normalization, caching, and region-aware endpoints
import AsyncStorage from '@react-native-async-storage/async-storage'
import { APP_CONFIG, STORAGE_KEYS, CATEGORIES } from './config'
import { createTribuneApi } from '../lib/tribune-api'
import { estimateReadingTime, isValidUrl } from './helpers'

const DEFAULT_TTL = APP_CONFIG?.api?.cacheTtlMs ?? 5 * 60 * 1000 // 5 minutes
const BASE_URL = APP_CONFIG?.api?.baseUrl?.replace(/\/$/, '') || ''
const tribune = createTribuneApi(BASE_URL)
const TIMEOUT = APP_CONFIG?.api?.timeout ?? 10000
const RETRIES = APP_CONFIG?.api?.retries ?? 2

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

async function fetchWithTimeout(url, options = {}, timeout = TIMEOUT) {
  // RN-safe timeout: Promise.race without AbortController
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
  ])
}

async function fetchWithRetry(url, options = {}) {
  let attempt = 0
  let lastErr
  while (attempt <= RETRIES) {
    try {
      const res = await fetchWithTimeout(url, options)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res
    } catch (e) {
      lastErr = e
      attempt += 1
      if (attempt > RETRIES) break
      await sleep(300 * attempt)
    }
  }
  throw lastErr
}

async function getCache(key) {
  try {
    const raw = await AsyncStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (!parsed.ts || Date.now() - parsed.ts > (parsed.ttl ?? DEFAULT_TTL)) return null
    return parsed.data
  } catch {
    return null
  }
}

async function setCache(key, data, ttl = DEFAULT_TTL) {
  try {
    const payload = JSON.stringify({ ts: Date.now(), ttl, data })
    await AsyncStorage.setItem(key, payload)
  } catch {
    // ignore
  }
}

function pick(...vals) {
  return vals.find((v) => v !== undefined && v !== null)
}

// Normalize article from various potential backends to app shape
export function normalizeArticle(raw) {
  if (!raw || typeof raw !== 'object') return null
  const id = String(
    pick(
      raw.id,
      raw._id,
      raw.guid,
      raw.url, // url as id fallback
      raw.link,
      `${raw.source?.id || raw.source?.name || 'src'}-${
        raw.publishedAt || raw.pubDate || Date.now()
      }`
    )
  )

  const title = String(pick(raw.title, raw.heading, 'Untitled'))
  const summary = String(
    pick(raw.summary, raw.description, raw.excerpt, raw.contentSnippet, raw.subtitle, '')
  )
  const content = String(pick(raw.content, raw.fullContent, raw.body, ''))
  const author = String(pick(raw.author, raw.creator, raw.byline, 'Unknown'))
  const publishDate = String(
    pick(raw.publishDate, raw.publishedAt, raw.pubDate, new Date().toISOString())
  )
  let category = String(pick(raw.category, raw.section, raw.topic, 'general'))
  // Map backend 'general' into app's 'top' pseudo-category
  if (category.toLowerCase() === 'general') category = 'top'
  // Structured media handling (new schema) with backward compatibility
  const media = raw.media && typeof raw.media === 'object' ? raw.media : {}
  const primaryImage = pick(
    media.imageUrl,
    raw.imageUrl,
    raw.urlToImage,
    raw.image,
    raw.thumbnail,
    raw.enclosure?.url,
    ''
  )
  const backendSafeImage = pick(media.safeImage, raw.safeImage, primaryImage)
  const thumbUrl = pick(media.thumbUrl, raw.thumbUrl, raw.thumbnail, primaryImage)
  const aspectRatio =
    Number(
      pick(media.imageAspectRatio, raw.imageAspectRatio, media.aspectRatio, raw.aspectRatio)
    ) || null
  const dominantColor = String(pick(media.dominantColor, raw.dominantColor, '')) || ''
  const blurHash = String(pick(media.blurHash, raw.blurHash, '')) || ''
  const mediaGenerated = !!pick(media.generated, raw.mediaGenerated, false)
  const mediaReason = String(pick(media.reason, raw.mediaReason, '')) || ''
  const mediaAttribution = String(pick(media.attribution, raw.mediaAttribution, '')) || ''
  const hasImage = !!pick(media.hasImage, raw.hasImage, raw.hasImageFlag, isValidUrl(primaryImage))
  const imageUrlOriginal = String(primaryImage || '')
  const safeImage =
    hasImage && isValidUrl(backendSafeImage)
      ? String(backendSafeImage)
      : hasImage && isValidUrl(imageUrlOriginal)
      ? imageUrlOriginal
      : ''

  // Prefer explicit backend-provided flat fields before nested variants
  const sourceName = String(
    pick(raw.sourceName, raw.displaySourceName, raw.source?.name, raw.source, raw.rights, '')
  )
  const displaySourceName = String(pick(raw.displaySourceName, sourceName))
  const sourceIconRaw = String(pick(raw.sourceIcon, raw.source?.icon, ''))
  const sourceIcon = isValidUrl(sourceIconRaw) ? sourceIconRaw : ''
  const sourceUrl = String(pick(raw.sourceUrl, raw.link, raw.url, ''))

  const safeThumb = hasImage && isValidUrl(thumbUrl) ? thumbUrl : ''
  const readTime = estimateReadingTime(content || summary || title)

  return {
    id,
    title,
    summary,
    content,
    author,
    publishDate,
    category,
    imageUrl: safeImage, // continue to expose imageUrl for legacy callers
    safeImage, // explicit field for future divergence
    thumbUrl: safeThumb,
    hasImage: !!(hasImage && safeImage),
    aspectRatio,
    dominantColor,
    blurHash,
    mediaGenerated,
    mediaReason,
    mediaAttribution,
    readTime,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    isBreaking: !!(raw.isBreaking || raw.breaking),
    likes: Number(pick(raw.likes, 0)) || 0,
    shares: Number(pick(raw.shares, 0)) || 0,
    sourceName,
    displaySourceName,
    sourceIcon,
    sourceUrl,
  }
}

// Legacy generic fetcher (non-region)
async function fetchAndNormalize(url, cacheKey, ttl) {
  // Try network, fallback to cache
  try {
    const res = await fetchWithRetry(url, { headers: { Accept: 'application/json' } })
    const json = await res.json()
    const items = Array.isArray(json?.items)
      ? json.items
      : Array.isArray(json?.articles)
      ? json.articles
      : Array.isArray(json)
      ? json
      : []
    const normalized = items.map(normalizeArticle).filter(Boolean)
    if (normalized.length) await setCache(cacheKey, normalized, ttl)
    return normalized
  } catch (e) {
    const cached = await getCache(cacheKey)
    if (cached) return cached
    throw e
  }
}

export async function getTopArticles({ ttl } = {}) {
  const url = `${BASE_URL}/top`
  const key = STORAGE_KEYS?.cache?.top || 'cache.top.v1'
  return fetchAndNormalize(url, key, ttl)
}

export async function getCategoryArticles(slug, { ttl } = {}) {
  const url = `${BASE_URL}/category/${encodeURIComponent(slug)}`
  const key = `${STORAGE_KEYS?.cache?.categoryPrefix || 'cache.category.v1.'}${slug}`
  return fetchAndNormalize(url, key, ttl)
}

export async function searchArticlesApi(query, categorySlug = 'all', { ttl } = {}) {
  const enc = encodeURIComponent
  const qs = `q=${enc(query)}${
    categorySlug && categorySlug !== 'all' ? `&category=${enc(categorySlug)}` : ''
  }`
  const url = `${BASE_URL}/search?${qs}`
  const key = `${STORAGE_KEYS?.cache?.searchPrefix || 'cache.search.v1.'}${categorySlug}.${query}`
  return fetchAndNormalize(url, key, ttl)
}

// Heuristic keyword-based classifier to refine 'top' (general) articles into specific categories.
function classifyCategory(article) {
  if (!article || !article.title) return null
  const text = `${article.title} ${article.summary || ''}`.toLowerCase()
  const tests = [
    {
      slug: 'technology',
      words: [
        'ai',
        'startup',
        'tech',
        'software',
        'app',
        'android',
        'ios',
        'silicon',
        'google',
        'apple',
        'microsoft',
      ],
    },
    {
      slug: 'sports',
      words: [
        'match',
        'tournament',
        'league',
        'cup',
        'goal',
        'cricket',
        'football',
        'soccer',
        'umpire',
        'wicket',
        'innings',
      ],
    },
    {
      slug: 'business',
      words: [
        'stocks',
        'market',
        'shares',
        'revenue',
        'earnings',
        'merger',
        'acquisition',
        'ipo',
        'inflation',
        'economy',
      ],
    },
    {
      slug: 'health',
      words: ['health', 'disease', 'covid', 'vaccine', 'hospital', 'medical', 'doctor', 'patients'],
    },
    {
      slug: 'science',
      words: ['research', 'scientists', 'nasa', 'space', 'quantum', 'experiment', 'study finds'],
    },
    {
      slug: 'entertainment',
      words: [
        'film',
        'movie',
        'celebrity',
        'music',
        'hollywood',
        'bollywood',
        'song',
        'box office',
        'series',
      ],
    },
    {
      slug: 'politics',
      words: ['election', 'parliament', 'senate', 'minister', 'policy', 'government'],
    },
  ]
  for (const t of tests) {
    if (!CATEGORIES[t.slug]) continue
    if (t.words.some((w) => text.includes(w))) return t.slug
  }
  return null
}

// Region-aware fetch with classification and caching
async function fetchNormalizeDirect(promise, cacheKey, ttl) {
  try {
    const wrapped = await promise
    const json = wrapped && wrapped.data ? wrapped.data : wrapped
    const items = Array.isArray(json?.items)
      ? json.items
      : Array.isArray(json?.articles)
      ? json.articles
      : Array.isArray(json)
      ? json
      : []
    let normalized = items.map(normalizeArticle).filter(Boolean)
    // Refine generic top articles via classifier
    normalized = normalized.map((a) => {
      if (!a || a.category !== 'top') return a
      const guess = classifyCategory(a)
      return guess ? { ...a, category: guess } : a
    })
    if (normalized.length) await setCache(cacheKey, normalized, ttl)
    return normalized
  } catch (e) {
    const cached = await getCache(cacheKey)
    if (cached) return cached
    throw e
  }
}

export async function getRegionTop(region = 'pk', { ttl } = {}) {
  const key = `${STORAGE_KEYS?.cache?.top || 'cache.top.v1'}.${region}`
  const prom = region === 'world' ? tribune.world() : tribune.pk()
  return fetchNormalizeDirect(prom, key, ttl)
}

export async function getRegionCategory(region = 'pk', slug, { ttl } = {}) {
  const backendSlug = slug === 'top' ? 'general' : slug
  const key = `${
    STORAGE_KEYS?.cache?.categoryPrefix || 'cache.category.v1.'
  }${region}.${backendSlug}`
  const prom =
    region === 'world' ? tribune.worldCategory(backendSlug) : tribune.pkCategory(backendSlug)
  const data = await fetchNormalizeDirect(prom, key, ttl)
  if (slug !== 'top') {
    return data.map((a) => ({ ...a, category: slug }))
  }
  return data
}
