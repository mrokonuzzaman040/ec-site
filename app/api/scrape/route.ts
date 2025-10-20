import { NextRequest, NextResponse } from 'next/server'
import { getScraper, closeScraper } from '@/lib/scraper'
import { ApiResponse } from '@/lib/types'
import { z } from 'zod'

const ScrapeRequestSchema = z.object({
  type: z.enum(['news', 'notices', 'officers', 'elections', 'all']).optional().default('all'),
  force: z.boolean().optional().default(false)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, force } = ScrapeRequestSchema.parse(body)
    
    const scraper = getScraper()
    let results: any = {}
    
    switch (type) {
      case 'news':
        results.news = await scraper.scrapeNews()
        break
      case 'notices':
        results.notices = await scraper.scrapeNotices()
        break
      case 'officers':
        results.officers = await scraper.scrapeOfficers()
        break
      case 'elections':
        results.elections = await scraper.scrapeElections()
        break
      case 'all':
      default:
        results = await scraper.scrapeAll()
        break
    }
    
    const totalItems = Object.values(results).reduce((sum: number, items: any) => {
      return sum + (Array.isArray(items) ? items.length : 0)
    }, 0)
    
    const response: ApiResponse = {
      success: true,
      data: results,
      message: `Successfully scraped ${totalItems} items`,
      count: totalItems
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Scraping API error:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to scrape data'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get scraping status and recent logs
    const { supabaseAdmin } = await import('@/lib/supabase')
    
    const { data: logs, error } = await supabaseAdmin
      .from('scraping_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    
    const response: ApiResponse = {
      success: true,
      data: {
        recent_logs: logs,
        status: 'ready'
      },
      message: 'Scraping status retrieved successfully'
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Scraping status API error:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to get scraping status'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}