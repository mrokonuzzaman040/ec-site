import cron from 'node-cron'
import { ECSWebScraper } from './scraper'
import { cacheService, CACHE_KEYS } from './cache'
import { ScrapingJob, ScrapingJobConfig } from './types'

export class SchedulerService {
  private static instance: SchedulerService
  private jobs: Map<string, cron.ScheduledTask> = new Map()
  private scraper: ECSWebScraper

  private constructor() {
    this.scraper = ECSWebScraper.getInstance()
  }

  public static getInstance(): SchedulerService {
    if (!SchedulerService.instance) {
      SchedulerService.instance = new SchedulerService()
    }
    return SchedulerService.instance
  }

  /**
   * Initialize default scraping schedules
   */
  public initializeDefaultSchedules(): void {
    console.log('Initializing default scraping schedules...')

    // Schedule news scraping every 2 hours
    this.scheduleJob('news-scraping', {
      id: 'news-scraping',
      name: 'News Scraping',
      schedule: '0 */2 * * *', // Every 2 hours
      data_type: 'news',
      enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    // Schedule notices scraping every 4 hours
    this.scheduleJob('notices-scraping', {
      id: 'notices-scraping',
      name: 'Notices Scraping',
      schedule: '0 */4 * * *', // Every 4 hours
      data_type: 'notices',
      enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    // Schedule officers scraping daily at 6 AM
    this.scheduleJob('officers-scraping', {
      id: 'officers-scraping',
      name: 'Officers Scraping',
      schedule: '0 6 * * *', // Daily at 6 AM
      data_type: 'officers',
      enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    // Schedule elections scraping daily at 8 AM
    this.scheduleJob('elections-scraping', {
      id: 'elections-scraping',
      name: 'Elections Scraping',
      schedule: '0 8 * * *', // Daily at 8 AM
      data_type: 'elections',
      enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    // Schedule cache cleanup every 6 hours
    this.scheduleJob('cache-cleanup', {
      id: 'cache-cleanup',
      name: 'Cache Cleanup',
      schedule: '0 */6 * * *', // Every 6 hours
      data_type: 'cache',
      enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    console.log(`Initialized ${this.jobs.size} scheduled jobs`)
  }

  /**
   * Schedule a new job
   */
  public scheduleJob(jobId: string, config: ScrapingJobConfig): boolean {
    try {
      // Stop existing job if it exists
      this.stopJob(jobId)

      if (!config.enabled) {
        console.log(`Job ${jobId} is disabled, skipping schedule`)
        return false
      }

      const task = cron.schedule(config.schedule, async () => {
        await this.executeJob(jobId, config)
      }, {
        scheduled: false, // Don't start immediately
        timezone: 'Asia/Dhaka' // Bangladesh timezone
      })

      this.jobs.set(jobId, task)
      task.start()

      console.log(`Scheduled job: ${jobId} with schedule: ${config.schedule}`)
      return true
    } catch (error) {
      console.error(`Failed to schedule job ${jobId}:`, error)
      return false
    }
  }

  /**
   * Execute a scheduled job
   */
  private async executeJob(jobId: string, config: ScrapingJobConfig): Promise<void> {
    console.log(`Executing scheduled job: ${jobId}`)

    try {
      switch (config.data_type) {
        case 'news':
          await this.scraper.scrapeNews()
          cacheService.invalidatePattern('news')
          break

        case 'notices':
          await this.scraper.scrapeNotices()
          cacheService.invalidatePattern('notices')
          break

        case 'officers':
          await this.scraper.scrapeOfficers()
          cacheService.invalidatePattern('officers')
          break

        case 'elections':
          await this.scraper.scrapeElections()
          cacheService.invalidatePattern('elections')
          break

        case 'cache':
          this.cleanupCache()
          break

        case 'all':
          await this.scraper.scrapeNews()
          await this.scraper.scrapeNotices()
          await this.scraper.scrapeOfficers()
          await this.scraper.scrapeElections()
          cacheService.invalidatePattern('data:')
          break

        default:
          console.warn(`Unknown data type for job ${jobId}: ${config.data_type}`)
      }

      console.log(`Successfully executed job: ${jobId}`)
    } catch (error) {
      console.error(`Failed to execute job ${jobId}:`, error)
    }
  }

  /**
   * Stop a scheduled job
   */
  public stopJob(jobId: string): boolean {
    try {
      const task = this.jobs.get(jobId)
      if (task) {
        task.stop()
        this.jobs.delete(jobId)
        console.log(`Stopped job: ${jobId}`)
        return true
      }
      return false
    } catch (error) {
      console.error(`Failed to stop job ${jobId}:`, error)
      return false
    }
  }

  /**
   * Get all active jobs
   */
  public getActiveJobs(): string[] {
    return Array.from(this.jobs.keys())
  }

  /**
   * Check if a job is running
   */
  public isJobRunning(jobId: string): boolean {
    const task = this.jobs.get(jobId)
    return task ? task.getStatus() === 'scheduled' : false
  }

  /**
   * Stop all jobs
   */
  public stopAllJobs(): void {
    console.log('Stopping all scheduled jobs...')
    this.jobs.forEach((task, jobId) => {
      task.stop()
      console.log(`Stopped job: ${jobId}`)
    })
    this.jobs.clear()
  }

  /**
   * Restart a job
   */
  public restartJob(jobId: string, config: ScrapingJobConfig): boolean {
    this.stopJob(jobId)
    return this.scheduleJob(jobId, config)
  }

  /**
   * Clean up old cache entries
   */
  private cleanupCache(): void {
    try {
      const stats = cacheService.getStats()
      console.log('Cache cleanup - Current stats:', stats)

      // Get all keys and check their age
      const keys = cacheService.keys()
      let cleanedCount = 0

      keys.forEach(key => {
        // Remove very old entries (older than 24 hours)
        const entry = cacheService.getCacheEntry(key)
        if (entry && entry.ttl > 0) {
          const age = Date.now() - new Date(entry.created_at).getTime()
          const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

          if (age > maxAge) {
            cacheService.del(key)
            cleanedCount++
          }
        }
      })

      console.log(`Cache cleanup completed. Removed ${cleanedCount} old entries.`)
    } catch (error) {
      console.error('Cache cleanup failed:', error)
    }
  }

  /**
   * Validate cron expression
   */
  public static validateCronExpression(expression: string): boolean {
    try {
      return cron.validate(expression)
    } catch (error) {
      return false
    }
  }

  /**
   * Get next execution time for a cron expression
   */
  public static getNextExecution(expression: string): Date | null {
    try {
      if (!cron.validate(expression)) {
        return null
      }

      // Create a temporary task to get next execution
      const task = cron.schedule(expression, () => {}, { scheduled: false })
      const nextDate = task.nextDate()
      task.destroy()

      return nextDate ? nextDate.toDate() : null
    } catch (error) {
      console.error('Failed to get next execution time:', error)
      return null
    }
  }
}

// Export singleton instance
export const schedulerService = SchedulerService.getInstance()

// Common cron expressions
export const CRON_EXPRESSIONS = {
  EVERY_MINUTE: '* * * * *',
  EVERY_5_MINUTES: '*/5 * * * *',
  EVERY_15_MINUTES: '*/15 * * * *',
  EVERY_30_MINUTES: '*/30 * * * *',
  EVERY_HOUR: '0 * * * *',
  EVERY_2_HOURS: '0 */2 * * *',
  EVERY_4_HOURS: '0 */4 * * *',
  EVERY_6_HOURS: '0 */6 * * *',
  EVERY_12_HOURS: '0 */12 * * *',
  DAILY_AT_MIDNIGHT: '0 0 * * *',
  DAILY_AT_6AM: '0 6 * * *',
  DAILY_AT_NOON: '0 12 * * *',
  WEEKLY_SUNDAY_MIDNIGHT: '0 0 * * 0',
  MONTHLY_FIRST_DAY: '0 0 1 * *',
} as const

// Initialize scheduler on module load in production
if (process.env.NODE_ENV === 'production') {
  // Initialize with a delay to ensure all services are ready
  setTimeout(() => {
    schedulerService.initializeDefaultSchedules()
  }, 5000)
}