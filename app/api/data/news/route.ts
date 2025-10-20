import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { NewsItemSchema, ApiResponseSchema } from '@/lib/types'
import { cacheService, CACHE_TTL, CacheService } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const language = searchParams.get('language') || 'bn'

    // Generate cache key
    const cacheKey = CacheService.generateDataKey('news', {
      page,
      limit,
      category,
      search,
      language
    })

    // Try to get from cache first
    const cached = cacheService.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('news')
      .select('*', { count: 'exact' })
      .order('published_date', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      if (language === 'en') {
        query = query.or(`title_en.ilike.%${search}%,content_en.ilike.%${search}%`)
      } else {
        query = query.or(`title_bn.ilike.%${search}%,content_bn.ilike.%${search}%`)
      }
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching news:', error)
      return NextResponse.json(
        { error: 'Failed to fetch news' },
        { status: 500 }
      )
    }

    const response = {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    }

    // Cache the response
    cacheService.set(cacheKey, response, CACHE_TTL.MEDIUM)

    return NextResponse.json(response)
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the news item
    const validatedNews = NewsItemSchema.parse(body)

    const { data, error } = await supabase
      .from('news')
      .insert([validatedNews])
      .select()
      .single()

    if (error) {
      console.error('Error inserting news:', error)
      return NextResponse.json(
        { error: 'Failed to insert news' },
        { status: 500 }
      )
    }

    // Invalidate news cache
    cacheService.invalidatePattern('news')

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('News POST error:', error)
    return NextResponse.json(
      { error: 'Invalid news data' },
      { status: 400 }
    )
  }
}