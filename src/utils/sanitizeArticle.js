// Utility to sanitize any article object to plain primitives
export default function sanitizeArticle(rawArticle) {
  // Handle case where rawArticle is null or undefined
  if (!rawArticle) {
    return {
      id: '',
      imageUrl: '',
      isBreaking: false,
      category: 'General',
      title: 'No title available',
      summary: 'No summary available',
      author: 'Unknown author',
      publishDate: '',
      readTime: '1 min read',
      likes: 0,
      shares: 0,
      content: '',
    }
  }

  // Safe string conversion function to avoid _toString errors
  const safeString = (value) => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    return ''
  }

  // Safe number conversion function
  const safeNumber = (value) => {
    if (value === null || value === undefined) return 0
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }

  return {
    id: safeString(rawArticle.id),
    imageUrl: safeString(rawArticle.imageUrl),
    isBreaking: !!rawArticle.isBreaking,
    category: safeString(rawArticle.category) || 'General',
    title: safeString(rawArticle.title) || 'No title available',
    summary: safeString(rawArticle.summary) || 'No summary available',
    author: safeString(rawArticle.author) || 'Unknown author',
    publishDate: safeString(rawArticle.publishDate),
    readTime: safeString(rawArticle.readTime) || '1 min read',
    likes: safeNumber(rawArticle.likes),
    shares: safeNumber(rawArticle.shares),
    content: safeString(rawArticle.content),
  }
}
