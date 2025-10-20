import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ApiResponse, PaginatedResponse, ElectionFilter, PaginationParams, ElectionFilterSchema, PaginationSchema } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse pagination parameters
    const paginationParams = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sort_by: searchParams.get('sort_by') || 'election_date',
      sort_order: searchParams.get('sort_order') || 'desc'
    })
    
    // Parse filter parameters
    const filterParams = ElectionFilterSchema.parse({
      status: searchParams.get('status') as any || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      search: searchParams.get('search') || undefined
    })
    
    // Build query
    let query = supabase
      .from('elections')
      .select('*', { count: 'exact' })
    
    // Apply filters
    if (filterParams.status) {
      query = query.eq('status', filterParams.status)
    }
    
    if (filterParams.date_from) {
      query = query.gte('election_date', filterParams.date_from)
    }
    
    if (filterParams.date_to) {
      query = query.lte('election_date', filterParams.date_to)
    }
    
    if (filterParams.search) {
      query = query.or(`title.ilike.%${filterParams.search}%,description.ilike.%${filterParams.search}%`)
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
    console.error('Elections API error:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to fetch elections data'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Insert new election
    const { data, error } = await supabase
      .from('elections')
      .insert(body)
      .select()
      .single()
    
    if (error) throw error
    
    const response: ApiResponse = {
      success: true,
      data,
      message: 'Election created successfully'
    }
    
    return NextResponse.json(response, { status: 201 })
    
  } catch (error) {
    console.error('Election creation API error:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to create election'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}