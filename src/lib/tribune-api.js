// Lightweight wrapper factory per user-provided interface
// Usage: const api = createTribuneApi(BASE_URL)
// api.world({ page:1, pageSize:20 }); api.pk({ ... });
// api.worldCategory('technology'); api.pkCategory('technology'); api.search('pakistan')

export function createTribuneApi(baseUrl) {
  // Expect baseUrl to be origin; if '/api' is included, strip it to avoid '/api/api/*'
  const BASE = String(baseUrl || '')
    .replace(/\/$/, '')
    .replace(/\/api$/, '')
  const headers = { Accept: 'application/json' }

  const fetchJson = async (path) => {
    const url = `${BASE}${path}`
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return {
      data,
      headers: {
        provider: res.headers.get('x-provider') || '',
        providerAttempts: res.headers.get('x-provider-attempts') || '',
        providerArticles: res.headers.get('x-provider-articles') || '',
      },
    }
  }

  return {
    world: ({ page = 1, pageSize = 20 } = {}) =>
      fetchJson(`/api/world?page=${page}&pageSize=${pageSize}`),
    pk: ({ page = 1, pageSize = 20 } = {}) =>
      fetchJson(`/api/pk?page=${page}&pageSize=${pageSize}`),
    // Category endpoints include /category/ segment per server spec
    worldCategory: (slug) => fetchJson(`/api/world/category/${encodeURIComponent(slug)}`),
    pkCategory: (slug) => fetchJson(`/api/pk/category/${encodeURIComponent(slug)}`),
    search: (q) => fetchJson(`/api/search?q=${encodeURIComponent(q)}`),
  }
}
