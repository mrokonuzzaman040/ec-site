import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ApiResponse, PaginatedResponse, NoticeFilter, PaginationParams, NoticeFilterSchema, PaginationSchema } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse pagination parameters
    const paginationParams = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sort_by: searchParams.get('sort_by') || 'created_at',
      sort_order: searchParams.get('sort_order') || 'desc'
    })
    
    // Parse filter parameters
    const filterParams = NoticeFilterSchema.parse({
      priority: searchParams.get('priority') as any || undefined,
      notice_type: searchParams.get('notice_type') || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      search: searchParams.get('search') || undefined
    })
    
    // Build query
    let query = supabase
      .from('notices')
      .select('*', { count: 'exact' })
    
    // Apply filters
    if (filterParams.priority) {
      query = query.eq('priority', filterParams.priority)
    }
    
    if (filterParams.notice_type) {
      query = query.eq('notice_type', filterParams.notice_type)
    }
    
    if (filterParams.date_from) {
      query = query.gte('published_date', filterParams.date_from)
    }
    
    if (filterParams.date_to) {
      query = query.lte('published_date', filterParams.date_to)
    }
    
    if (filterParams.search) {
      query = query.or(`title.ilike.%${filterParams.search}%,content.ilike.%${filterParams.search}%`)
    }
    
    // Apply sorting
    query = query.order(paginationParams.sort_by, { ascending: paginationParams.sort_order === 'asc' })
    
    // Apply pagination
    const from = (paginationParams.page - 1) * paginationParams.limit
    const to = from + paginationParams.limit - 1
    query = query.range(from, to)
    
    const { data, error, count } = await query
    
    if (error) throw error
    
    const totalPages = Math.ceil((count || 0) / paginationParams.limit)
    
    const response: PaginatedResponse<any> = {
      success: true,
      data: data || [],
      count: data?.length || 0,
      pagination: {
        page: paginationParams.page,
        limit: paginationParams.limit,
        total: count || 0,
        total_pages: totalPages,
        has_next: paginationParams.page < totalPages,
        has_prev: paginationParams.page > 1
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Notices API error:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to fetch notices data'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Insert new notice item
    const { data, error } = await supabase
      .from('notices')
      .insert(body)
      .select()
      .single()
    
    if (error) throw error
    
    const response: ApiResponse = {
      success: true,
      data,
      message: 'Notice created successfully'
    }
    
    return NextResponse.json(response, { status: 201 })
    
  } catch (error) {
    console.error('Notice creation API error:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to create notice'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}