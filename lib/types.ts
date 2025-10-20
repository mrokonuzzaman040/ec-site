import { z } from 'zod'

// Base types
export type Language = 'en' | 'bn'
export type ScrapingStatus = 'running' | 'completed' | 'failed' | 'cancelled'
export type NotificationPriority = 'high' | 'medium' | 'low'
export type ElectionStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

// Zod schemas for validation
export const NewsItemSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(500),
  content: z.string().optional(),
  title_bn: z.string().max(500).optional(),
  content_bn: z.string().optional(),
  category: z.string().max(100).optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  published_date: z.string().datetime().optional(),
  scraped_at: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const NoticeItemSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(500),
  content: z.string().optional(),
  title_bn: z.string().max(500).optional(),
  content_bn: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  notice_type: z.string().max(100).optional(),
  file_url: z.string().url().optional().or(z.literal('')),
  published_date: z.string().datetime().optional(),
  scraped_at: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const OfficerItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required').max(200),
  name_bn: z.string().max(200).optional(),
  position: z.string().max(200).optional(),
  position_bn: z.string().max(200).optional(),
  department: z.string().max(200).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  hierarchy_level: z.number().int().min(0).default(0),
  scraped_at: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const ElectionItemSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(500),
  title_bn: z.string().max(500).optional(),
  description: z.string().optional(),
  description_bn: z.string().optional(),
  election_date: z.string().date().optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
  results: z.any().optional(),
  scraped_at: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const ScrapingLogSchema = z.object({
  id: z.string().uuid().optional(),
  job_id: z.string().min(1, 'Job ID is required').max(100),
  target_type: z.string().min(1, 'Target type is required').max(50),
  status: z.enum(['running', 'completed', 'failed', 'cancelled']).default('running'),
  error_message: z.string().optional(),
  items_scraped: z.number().int().min(0).default(0),
  started_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
})

// TypeScript types derived from Zod schemas
export type NewsItem = z.infer<typeof NewsItemSchema>
export type NoticeItem = z.infer<typeof NoticeItemSchema>
export type OfficerItem = z.infer<typeof OfficerItemSchema>
export type ElectionItem = z.infer<typeof ElectionItemSchema>
export type ScrapingLog = z.infer<typeof ScrapingLogSchema>

// API Response types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  count: z.number().optional(),
})

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

// Scraping configuration types
export const ScrapingConfigSchema = z.object({
  target_url: z.string().url(),
  target_type: z.enum(['news', 'notices', 'officers', 'elections']),
  selectors: z.object({
    container: z.string(),
    title: z.string(),
    content: z.string().optional(),
    image: z.string().optional(),
    date: z.string().optional(),
    link: z.string().optional(),
  }),
  rate_limit_ms: z.number().min(1000).default(2000),
  timeout_ms: z.number().min(5000).default(30000),
  max_items: z.number().min(1).max(100).default(50),
})

export type ScrapingConfig = z.infer<typeof ScrapingConfigSchema>

// Pagination types
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
})

export type PaginationParams = z.infer<typeof PaginationSchema>

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

// Filter types
export const NewsFilterSchema = z.object({
  category: z.string().optional(),
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
  search: z.string().optional(),
})

export const NoticeFilterSchema = z.object({
  priority: z.enum(['high', 'medium', 'low']).optional(),
  notice_type: z.string().optional(),
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
  search: z.string().optional(),
})

export const OfficerFilterSchema = z.object({
  department: z.string().optional(),
  hierarchy_level: z.number().int().min(0).optional(),
  search: z.string().optional(),
})

export const ElectionFilterSchema = z.object({
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).optional(),
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
  search: z.string().optional(),
})

export type NewsFilter = z.infer<typeof NewsFilterSchema>
export type NoticeFilter = z.infer<typeof NoticeFilterSchema>
export type OfficerFilter = z.infer<typeof OfficerFilterSchema>
export type ElectionFilter = z.infer<typeof ElectionFilterSchema>

// Scraping job types
export interface ScrapingJob {
  id: string
  type: 'news' | 'notices' | 'officers' | 'elections'
  status: ScrapingStatus
  progress: number
  started_at: Date
  estimated_completion?: Date
  error?: string
}

// Cache types
export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

// Admin dashboard types
export interface DashboardStats {
  total_news: number
  total_notices: number
  total_officers: number
  total_elections: number
  last_scrape_time: string
  active_jobs: number
  failed_jobs_today: number
}

export const AdminConfigSchema = z.object({
  scraping_enabled: z.boolean().default(true),
  auto_scrape_interval: z.number().min(300).default(3600), // seconds
  rate_limit_ms: z.number().min(1000).default(2000),
  max_concurrent_jobs: z.number().min(1).max(5).default(2),
  notification_email: z.string().email().optional(),
  backup_enabled: z.boolean().default(true),
})

export type AdminConfig = z.infer<typeof AdminConfigSchema>