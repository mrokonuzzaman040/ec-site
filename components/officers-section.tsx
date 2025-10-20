'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, RefreshCw, Users } from 'lucide-react'
import { OfficerItem } from '@/lib/types'
import { useLanguage } from '@/contexts/language-context'

export default function OfficersSection() {
  const [officers, setOfficers] = useState<OfficerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scraping, setScraping] = useState(false)
  const { t, language } = useLanguage()

  const fetchOfficers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/data/officers?language=${language}`)
      if (!response.ok) {
        throw new Error('Failed to fetch officers')
      }
      const data = await response.json()
      setOfficers(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch officers')
    } finally {
      setLoading(false)
    }
  }

  const triggerScraping = async () => {
    try {
      setScraping(true)
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'officers' }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to trigger scraping')
      }
      
      // Wait a moment then refresh data
      setTimeout(() => {
        fetchOfficers()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger scraping')
    } finally {
      setScraping(false)
    }
  }

  useEffect(() => {
    fetchOfficers()
  }, [language])

  const getOfficerImage = (officer: OfficerItem) => {
    if (officer.image_url) {
      return (
        <img 
          src={officer.image_url} 
          alt={officer.name_en || officer.name_bn}
          className="w-full h-full object-cover"
        />
      )
    }
    return <Users className="w-16 h-16 text-white" />
  }

  const getOfficerName = (officer: OfficerItem) => {
    return language === 'bn' 
      ? (officer.name_bn || officer.name_en || t('officers.unknownOfficer'))
      : (officer.name_en || officer.name_bn || t('officers.unknownOfficer'))
  }

  const getOfficerTitle = (officer: OfficerItem) => {
    return language === 'bn'
      ? (officer.title_bn || officer.title_en || t('officers.officer'))
      : (officer.title_en || officer.title_bn || t('officers.officer'))
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
          <Skeleton className="h-10 w-80 mb-2" />
          <Skeleton className="h-1 w-16" />
        </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden border border-border">
                <Skeleton className="h-40 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t('officers.title')}</h2>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
          </div>
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('officers.errorLoading')}</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchOfficers} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t('officers.title')}</h2>
          <div className="w-16 h-1 bg-primary rounded-full"></div>
        </div>

        {officers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('officers.noOfficers')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('officers.noOfficersDescription')}
            </p>
            <Button 
              onClick={triggerScraping} 
              disabled={scraping}
              className="bg-primary hover:bg-primary/90"
            >
              {scraping ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t('officers.scrapingOfficers')}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('officers.scrapeOfficers')}
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {officers.map((officer) => (
              <div
                key={officer.id}
                className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition text-center"
              >
                <div className="bg-primary h-40 flex items-center justify-center">
                  {getOfficerImage(officer)}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {getOfficerName(officer)}
                  </h3>
                  <p className="text-sm text-primary font-semibold">
                    {getOfficerTitle(officer)}
                  </p>
                  {officer.department && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {officer.department}
                    </p>
                  )}
                  {officer.email && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {officer.email}
                    </p>
                  )}
                  {officer.phone && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {officer.phone}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
