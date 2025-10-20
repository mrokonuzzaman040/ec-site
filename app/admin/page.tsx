'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Activity, 
  Database, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileText,
  Users,
  Calendar,
  Newspaper
} from 'lucide-react'
import { ScrapingLog, AdminDashboardStats } from '@/lib/types'
import { useLanguage } from '@/contexts/language-context'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [logs, setLogs] = useState<ScrapingLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scraping, setScraping] = useState(false)
  const { t } = useLanguage()

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch scraping status and logs
      const response = await fetch('/api/scrape')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      setLogs(data.logs || [])
      
      // Calculate stats from logs and data
      const newsResponse = await fetch('/api/data/news')
      const noticesResponse = await fetch('/api/data/notices')
      const officersResponse = await fetch('/api/data/officers')
      const electionsResponse = await fetch('/api/data/elections')
      
      const newsData = newsResponse.ok ? await newsResponse.json() : { data: [] }
      const noticesData = noticesResponse.ok ? await noticesResponse.json() : { data: [] }
      const officersData = officersResponse.ok ? await officersResponse.json() : { data: [] }
      const electionsData = electionsResponse.ok ? await electionsResponse.json() : { data: [] }
      
      const calculatedStats: AdminDashboardStats = {
        total_news: newsData.data?.length || 0,
        total_notices: noticesData.data?.length || 0,
        total_officers: officersData.data?.length || 0,
        total_elections: electionsData.data?.length || 0,
        last_scrape_time: data.logs?.[0]?.created_at || null,
        scraping_status: data.status || 'idle',
        success_rate: data.logs?.length > 0 
          ? (data.logs.filter((log: ScrapingLog) => log.status === 'success').length / data.logs.length) * 100 
          : 0,
        total_scrapes: data.logs?.length || 0
      }
      
      setStats(calculatedStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const triggerFullScrape = async () => {
    try {
      setScraping(true)
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'all', force: true }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to trigger scraping')
      }
      
      // Refresh data after a delay
      setTimeout(() => {
        fetchDashboardData()
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger scraping')
    } finally {
      setScraping(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">{t('admin.status.success')}</Badge>
      case 'error':
        return <Badge variant="destructive">{t('admin.status.error')}</Badge>
      case 'running':
        return <Badge variant="secondary">{t('admin.status.running')}</Badge>
      case 'idle':
        return <Badge variant="outline">{t('admin.status.idle')}</Badge>
      default:
        return <Badge variant="outline">{t('admin.status.unknown')}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('admin.title')}</h1>
        <p className="text-muted-foreground">{t('admin.description')}</p>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.stats.totalNews')}</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_news || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.stats.totalNotices')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_notices || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.stats.totalOfficers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_officers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.stats.totalElections')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_elections || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {t('admin.systemStatus.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>{t('admin.systemStatus.scrapingStatus')}:</span>
              {getStatusBadge(stats?.scraping_status || 'idle')}
            </div>
            <div className="flex justify-between items-center">
              <span>{t('admin.systemStatus.successRate')}:</span>
              <span className="font-semibold">{stats?.success_rate?.toFixed(1) || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{t('admin.systemStatus.totalScrapes')}:</span>
              <span className="font-semibold">{stats?.total_scrapes || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{t('admin.systemStatus.lastScrape')}:</span>
              <span className="text-sm text-muted-foreground">
                {stats?.last_scrape_time ? formatDate(stats.last_scrape_time) : t('admin.systemStatus.never')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              {t('admin.quickActions.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={triggerFullScrape} 
              disabled={scraping}
              className="w-full"
            >
              {scraping ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t('admin.quickActions.scrapingAll')}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('admin.quickActions.triggerFullScrape')}
                </>
              )}
            </Button>
            <Button 
              onClick={fetchDashboardData} 
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('admin.quickActions.refreshDashboard')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.logs.title')}</CardTitle>
          <CardDescription>{t('admin.logs.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('admin.logs.noLogs')}
            </div>
          ) : (
            <div className="space-y-4">
              {logs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <div className="font-medium">{log.data_type} {t('admin.logs.scraping')}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(log.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(log.status)}
                    {log.items_scraped !== null && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {log.items_scraped} {t('admin.logs.items')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}