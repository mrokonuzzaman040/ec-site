'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Download, RefreshCw, Clock, AlertCircle } from 'lucide-react'
import { NoticeItem } from '@/lib/types'
import { useLanguage } from '@/contexts/language-context'

export default function NoticesSection() {
  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchNotices()
  }, [language])

  const fetchNotices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/data/notices?limit=8&sort_by=created_at&sort_order=desc&language=${language}`)
      if (!response.ok) {
        throw new Error('Failed to fetch notices')
      }
      const data = await response.json()
      setNotices(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleScrapeNotices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'notices' })
      })
      if (!response.ok) {
        throw new Error('Failed to scrape notices')
      }
      await fetchNotices()
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-primary'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return t('notices.priority.high')
      case 'medium': return t('notices.priority.medium')
      case 'low': return t('notices.priority.low')
      default: return t('notices.priority.medium')
    }
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">নোটিশ ও আদেশ</h2>
            <div className="w-16 h-1 rounded-full bg-primary"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card p-6 rounded-lg border border-border animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2 w-20"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t('notices.title')}</h2>
            <div className="w-16 h-1 rounded-full bg-primary"></div>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{t('notices.failedToLoad')}: {error}</p>
            <Button onClick={fetchNotices} variant="outline" className="flex items-center gap-2 mx-auto">
              <RefreshCw className="h-4 w-4" />
              {t('common.retry')}
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t('notices.title')}</h2>
          <div className="w-16 h-1 rounded-full bg-primary"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {notices.length > 0 ? notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-card p-6 rounded-lg border border-border hover:border-primary transition cursor-pointer group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${getPriorityColor(notice.priority)}`}>
                      {getPriorityText(notice.priority)}
                    </span>
                    {notice.notice_type && (
                      <span className="text-xs font-semibold bg-opacity-10 px-3 py-1 rounded-full text-background bg-primary">
                        {notice.notice_type}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition mb-2">
                    {notice.title_bn || notice.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(notice.published_date || notice.created_at)}
                  </p>
                  {notice.file_url && (
                    <a 
                      href={notice.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-2 inline-block"
                    >
                      ফাইল ডাউনলোড করুন
                    </a>
                  )}
                </div>
                <div className="text-2xl">📄</div>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground mb-4">{t('notices.noNotices')}</p>
              <Button onClick={fetchNotices} variant="outline" className="flex items-center gap-2 mx-auto">
                <RefreshCw className="h-4 w-4" />
                {t('notices.scrapeNotices')}
              </Button>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <button className="text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition bg-primary">
            সকল নোটিশ দেখুন
          </button>
        </div>
      </div>
    </section>
  )
}
