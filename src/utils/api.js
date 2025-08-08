// Centralized API client with retries, timeout, normalization, and caching
import AsyncStorage from '@react-native-async-storage/async-storage'
import { APP_CONFIG, STORAGE_KEYS } from './config'
import { estimateReadingTime, isValidUrl } from './helpers'

const DEFAULT_TTL = APP_CONFIG?.api?.cacheTtlMs ?? 5 * 60 * 1000 // 5 minutes
const BASE_URL = APP_CONFIG?.api?.baseUrl?.replace(/\/$/, '') || ''
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
  const category = String(pick(raw.category, raw.section, raw.topic, 'general'))
  const imageUrl = String(
    pick(raw.imageUrl, raw.urlToImage, raw.image, raw.thumbnail, raw.enclosure?.url, '') || ''
  )

  const sourceName = String(pick(raw.source?.name, raw.source, raw.rights, ''))
  const sourceUrl = String(pick(raw.sourceUrl, raw.link, raw.url, ''))

  const safeImage = isValidUrl(imageUrl) ? imageUrl : ''
  const readTime = estimateReadingTime(content || summary || title)

  return {
    id,
    title,
    summary,
    content,
    author,
    publishDate,
    category,
    imageUrl: safeImage,
    readTime,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    isBreaking: !!(raw.isBreaking || raw.breaking),
    likes: Number(pick(raw.likes, 0)) || 0,
    shares: Number(pick(raw.shares, 0)) || 0,
    sourceName,
    sourceUrl,
  }
}

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
