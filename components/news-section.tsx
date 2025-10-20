'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, ArrowRight, RefreshCw } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { NewsItem } from '@/lib/types'

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchNews()
  }, [language])

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/data/news?limit=6&sort_by=created_at&sort_order=desc&language=${language}`)
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }
      const data = await response.json()
      setNews(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'তারিখ নেই'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'তারিখ নেই'
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">সর্বশেষ সংবাদ</h2>
            <div className="w-16 h-1 rounded-full bg-secondary"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden border border-border animate-pulse">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t('news.title')}</h2>
            <div className="w-16 h-1 rounded-full bg-secondary"></div>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{t('news.failedToLoad')}: {error}</p>
            <Button onClick={fetchNews} variant="outline" className="flex items-center gap-2 mx-auto">
              <RefreshCw className="h-4 w-4" />
              {t('common.retry')}
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t('news.title')}</h2>
          <div className="w-16 h-1 rounded-full bg-secondary"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {news.length > 0 ? news.map((item) => (
            <article
              key={item.id}
              className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition"
            >
              <div className="h-32 flex items-center justify-center bg-secondary">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">📰</span>
                )}
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-3">
                  {item.category && (
                    <span className="text-xs font-semibold bg-opacity-10 px-3 py-1 rounded-full bg-secondary text-background">
                      {item.category}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.published_date || item.created_at)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                  {item.title_bn || item.title}
                </h3>
                {(item.content_bn || item.content) && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {truncateText(item.content_bn || item.content || '', 120)}
                  </p>
                )}
                <a href="#" className="font-semibold hover:text-secondary transition text-secondary">
                  {t('common.readMore')} →
                </a>
              </div>
            </article>
          )) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground mb-4">{t('news.noNews')}</p>
              <Button onClick={fetchNews} variant="outline" className="flex items-center gap-2 mx-auto">
                <RefreshCw className="h-4 w-4" />
                {t('news.scrapeNews')}
              </Button>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <button className="text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition bg-secondary">
            সকল সংবাদ দেখুন
          </button>
        </div>
      </div>
    </section>
  )
}
