import puppeteer, { Browser, Page } from 'puppeteer'
import * as cheerio from 'cheerio'
import { supabaseAdmin } from './supabase'
import { 
  NewsItem, 
  NoticeItem, 
  OfficerItem, 
  ElectionItem, 
  ScrapingLog,
  ScrapingConfig,
  NewsItemSchema,
  NoticeItemSchema,
  OfficerItemSchema,
  ElectionItemSchema
} from './types'

export class ECSWebScraper {
  private browser: Browser | null = null
  private rateLimitMs: number
  private timeoutMs: number
  private userAgent: string

  constructor() {
    this.rateLimitMs = parseInt(process.env.SCRAPING_RATE_LIMIT_MS || '2000')
    this.timeoutMs = parseInt(process.env.SCRAPING_TIMEOUT_MS || '30000')
    this.userAgent = process.env.SCRAPING_USER_AGENT || 'ECS-Scraper/1.0'
  }

  private async initBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      })
    }
  }

  private async createPage(): Promise<Page> {
    await this.initBrowser()
    const page = await this.browser!.newPage()
    
    await page.setUserAgent(this.userAgent)
    await page.setViewport({ width: 1920, height: 1080 })
    
    // Set timeout
    page.setDefaultTimeout(this.timeoutMs)
    
    return page
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async logScrapingStart(jobId: string, targetType: string): Promise<void> {
    await supabaseAdmin
      .from('scraping_logs')
      .insert({
        job_id: jobId,
        target_type: targetType,
        status: 'running',
        started_at: new Date().toISOString()
      })
  }

  private async logScrapingComplete(jobId: string, itemsScraped: number, error?: string): Promise<void> {
    await supabaseAdmin
      .from('scraping_logs')
      .update({
        status: error ? 'failed' : 'completed',
        items_scraped: itemsScraped,
        error_message: error,
        completed_at: new Date().toISOString()
      })
      .eq('job_id', jobId)
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim()
  }

  private extractDate(dateStr: string): string | undefined {
    if (!dateStr) return undefined
    
    // Try to parse various date formats
    const patterns = [
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
      /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
      /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i
    ]
    
    for (const pattern of patterns) {
      const match = dateStr.match(pattern)
      if (match) {
        try {
          const date = new Date(dateStr)
          if (!isNaN(date.getTime())) {
            return date.toISOString()
          }
        } catch (e) {
          continue
        }
      }
    }
    
    return undefined
  }

  async scrapeNews(): Promise<NewsItem[]> {
    const jobId = this.generateJobId()
    await this.logScrapingStart(jobId, 'news')
    
    let page: Page | null = null
    let scrapedItems: NewsItem[] = []
    
    try {
      page = await this.createPage()
      
      // Navigate to ECS news page
      await page.goto('https://www.ecs.gov.bd/', { waitUntil: 'networkidle2' })
      
      // Wait for content to load
      await page.waitForSelector('body', { timeout: 10000 })
      
      const content = await page.content()
      const $ = cheerio.load(content)
      
      // Extract news items - adjust selectors based on actual website structure
      const newsItems: NewsItem[] = []
      
      // Look for common news patterns
      const newsSelectors = [
        '.news-item',
        '.news-list li',
        '.latest-news .item',
        '[class*="news"] a',
        '.content-area .post'
      ]
      
      for (const selector of newsSelectors) {
        const elements = $(selector)
        if (elements.length > 0) {
          elements.each((_, element) => {
            const $el = $(element)
            const title = this.cleanText($el.find('h1, h2, h3, h4, .title, .headline').first().text() || $el.text())
            
            if (title && title.length > 10) {
              const newsItem: NewsItem = {
                title,
                content: this.cleanText($el.find('p, .content, .description').first().text()),
                image_url: $el.find('img').first().attr('src') || undefined,
                published_date: this.extractDate($el.find('.date, .time, [class*="date"]').first().text()),
                scraped_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              
              // Validate with Zod
              const validated = NewsItemSchema.safeParse(newsItem)
              if (validated.success) {
                newsItems.push(validated.data)
              }
            }
          })
          
          if (newsItems.length > 0) break // Found news items, stop trying other selectors
        }
      }
      
      // If no specific news found, try to extract from general content
      if (newsItems.length === 0) {
        $('a').each((_, element) => {
          const $el = $(element)
          const text = this.cleanText($el.text())
          const href = $el.attr('href')
          
          if (text.length > 20 && text.length < 200 && href) {
            const newsItem: NewsItem = {
              title: text,
              scraped_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            
            const validated = NewsItemSchema.safeParse(newsItem)
            if (validated.success) {
              newsItems.push(validated.data)
            }
          }
        })
      }
      
      scrapedItems = newsItems.slice(0, 20) // Limit to 20 items
      
      // Save to database
      if (scrapedItems.length > 0) {
        await supabaseAdmin
          .from('news')
          .insert(scrapedItems)
      }
      
      await this.logScrapingComplete(jobId, scrapedItems.length)
      await this.delay(this.rateLimitMs)
      
    } catch (error) {
      console.error('Error scraping news:', error)
      await this.logScrapingComplete(jobId, scrapedItems.length, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      if (page) await page.close()
    }
    
    return scrapedItems
  }

  async scrapeNotices(): Promise<NoticeItem[]> {
    const jobId = this.generateJobId()
    await this.logScrapingStart(jobId, 'notices')
    
    let page: Page | null = null
    let scrapedItems: NoticeItem[] = []
    
    try {
      page = await this.createPage()
      
      await page.goto('https://www.ecs.gov.bd/', { waitUntil: 'networkidle2' })
      await page.waitForSelector('body', { timeout: 10000 })
      
      const content = await page.content()
      const $ = cheerio.load(content)
      
      const noticeItems: NoticeItem[] = []
      
      // Look for notice patterns
      const noticeSelectors = [
        '.notice-item',
        '.notice-list li',
        '.notices .item',
        '[class*="notice"] a',
        '.announcements .item'
      ]
      
      for (const selector of noticeSelectors) {
        const elements = $(selector)
        if (elements.length > 0) {
          elements.each((_, element) => {
            const $el = $(element)
            const title = this.cleanText($el.find('h1, h2, h3, h4, .title').first().text() || $el.text())
            
            if (title && title.length > 10) {
              const noticeItem: NoticeItem = {
                title,
                content: this.cleanText($el.find('p, .content, .description').first().text()),
                priority: title.toLowerCase().includes('urgent') || title.toLowerCase().includes('important') ? 'high' : 'medium',
                file_url: $el.find('a[href*=".pdf"], a[href*=".doc"]').first().attr('href') || undefined,
                published_date: this.extractDate($el.find('.date, .time, [class*="date"]').first().text()),
                scraped_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              
              const validated = NoticeItemSchema.safeParse(noticeItem)
              if (validated.success) {
                noticeItems.push(validated.data)
              }
            }
          })
          
          if (noticeItems.length > 0) break
        }
      }
      
      scrapedItems = noticeItems.slice(0, 20)
      
      if (scrapedItems.length > 0) {
        await supabaseAdmin
          .from('notices')
          .insert(scrapedItems)
      }
      
      await this.logScrapingComplete(jobId, scrapedItems.length)
      await this.delay(this.rateLimitMs)
      
    } catch (error) {
      console.error('Error scraping notices:', error)
      await this.logScrapingComplete(jobId, scrapedItems.length, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      if (page) await page.close()
    }
    
    return scrapedItems
  }

  async scrapeOfficers(): Promise<OfficerItem[]> {
    const jobId = this.generateJobId()
    await this.logScrapingStart(jobId, 'officers')
    
    let page: Page | null = null
    let scrapedItems: OfficerItem[] = []
    
    try {
      page = await this.createPage()
      
      await page.goto('https://www.ecs.gov.bd/', { waitUntil: 'networkidle2' })
      await page.waitForSelector('body', { timeout: 10000 })
      
      const content = await page.content()
      const $ = cheerio.load(content)
      
      const officerItems: OfficerItem[] = []
      
      // Look for officer/staff patterns
      const officerSelectors = [
        '.officer-item',
        '.staff-list li',
        '.officers .item',
        '[class*="officer"] .person',
        '.team-member'
      ]
      
      for (const selector of officerSelectors) {
        const elements = $(selector)
        if (elements.length > 0) {
          elements.each((_, element) => {
            const $el = $(element)
            const name = this.cleanText($el.find('.name, h1, h2, h3, h4').first().text())
            
            if (name && name.length > 2) {
              const officerItem: OfficerItem = {
                name,
                position: this.cleanText($el.find('.position, .title, .designation').first().text()),
                department: this.cleanText($el.find('.department, .office').first().text()),
                email: $el.find('a[href^="mailto:"]').first().attr('href')?.replace('mailto:', '') || undefined,
                phone: this.cleanText($el.find('.phone, .mobile, [class*="phone"]').first().text()),
                image_url: $el.find('img').first().attr('src') || undefined,
                hierarchy_level: 0,
                scraped_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              
              const validated = OfficerItemSchema.safeParse(officerItem)
              if (validated.success) {
                officerItems.push(validated.data)
              }
            }
          })
          
          if (officerItems.length > 0) break
        }
      }
      
      scrapedItems = officerItems.slice(0, 20)
      
      if (scrapedItems.length > 0) {
        await supabaseAdmin
          .from('officers')
          .insert(scrapedItems)
      }
      
      await this.logScrapingComplete(jobId, scrapedItems.length)
      await this.delay(this.rateLimitMs)
      
    } catch (error) {
      console.error('Error scraping officers:', error)
      await this.logScrapingComplete(jobId, scrapedItems.length, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      if (page) await page.close()
    }
    
    return scrapedItems
  }

  async scrapeElections(): Promise<ElectionItem[]> {
    const jobId = this.generateJobId()
    await this.logScrapingStart(jobId, 'elections')
    
    let page: Page | null = null
    let scrapedItems: ElectionItem[] = []
    
    try {
      page = await this.createPage()
      
      await page.goto('https://www.ecs.gov.bd/', { waitUntil: 'networkidle2' })
      await page.waitForSelector('body', { timeout: 10000 })
      
      const content = await page.content()
      const $ = cheerio.load(content)
      
      const electionItems: ElectionItem[] = []
      
      // Look for election patterns
      const electionSelectors = [
        '.election-item',
        '.elections li',
        '[class*="election"] .item',
        '.voting-info',
        '.election-schedule'
      ]
      
      for (const selector of electionSelectors) {
        const elements = $(selector)
        if (elements.length > 0) {
          elements.each((_, element) => {
            const $el = $(element)
            const title = this.cleanText($el.find('h1, h2, h3, h4, .title').first().text() || $el.text())
            
            if (title && title.length > 10) {
              const electionItem: ElectionItem = {
                title,
                description: this.cleanText($el.find('p, .content, .description').first().text()),
                election_date: this.extractDate($el.find('.date, .time, [class*="date"]').first().text())?.split('T')[0],
                status: 'upcoming',
                scraped_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              
              const validated = ElectionItemSchema.safeParse(electionItem)
              if (validated.success) {
                electionItems.push(validated.data)
              }
            }
          })
          
          if (electionItems.length > 0) break
        }
      }
      
      scrapedItems = electionItems.slice(0, 20)
      
      if (scrapedItems.length > 0) {
        await supabaseAdmin
          .from('elections')
          .insert(scrapedItems)
      }
      
      await this.logScrapingComplete(jobId, scrapedItems.length)
      await this.delay(this.rateLimitMs)
      
    } catch (error) {
      console.error('Error scraping elections:', error)
      await this.logScrapingComplete(jobId, scrapedItems.length, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      if (page) await page.close()
    }
    
    return scrapedItems
  }

  async scrapeAll(): Promise<{
    news: NewsItem[]
    notices: NoticeItem[]
    officers: OfficerItem[]
    elections: ElectionItem[]
  }> {
    const results = {
      news: await this.scrapeNews(),
      notices: await this.scrapeNotices(),
      officers: await this.scrapeOfficers(),
      elections: await this.scrapeElections()
    }
    
    return results
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}

// Singleton instance
let scraperInstance: ECSWebScraper | null = null

export function getScraper(): ECSWebScraper {
  if (!scraperInstance) {
    scraperInstance = new ECSWebScraper()
  }
  return scraperInstance
}

export async function closeScraper(): Promise<void> {
  if (scraperInstance) {
    await scraperInstance.close()
    scraperInstance = null
  }
}