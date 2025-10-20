import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations with elevated privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export interface NewsItem {
  id: string
  title: string
  content?: string
  title_bn?: string
  content_bn?: string
  category?: string
  image_url?: string
  published_date?: string
  scraped_at: string
  created_at: string
  updated_at: string
}

export interface NoticeItem {
  id: string
  title: string
  content?: string
  title_bn?: string
  content_bn?: string
  priority: 'high' | 'medium' | 'low'
  notice_type?: string
  file_url?: string
  published_date?: string
  scraped_at: string
  created_at: string
  updated_at: string
}

export interface OfficerItem {
  id: string
  name: string
  name_bn?: string
  position?: string
  position_bn?: string
  department?: string
  email?: string
  phone?: string
  image_url?: string
  hierarchy_level: number
  scraped_at: string
  created_at: string
  updated_at: string
}

export interface ElectionItem {
  id: string
  title: string
  title_bn?: string
  description?: string
  description_bn?: string
  election_date?: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  results?: any
  scraped_at: string
  created_at: string
  updated_at: string
}

export interface ScrapingLog {
  id: string
  job_id: string
  target_type: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  error_message?: string
  items_scraped: number
  started_at: string
  completed_at?: string
  created_at: string
}