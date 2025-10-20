import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ApiResponse, PaginatedResponse, OfficerFilter, PaginationParams, OfficerFilterSchema, PaginationSchema } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse pagination parameters
    const paginationParams = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sort_by: searchParams.get('sort_by') || 'hierarchy_level',
      sort_order: searchParams.get('sort_order') || 'asc'
    })
    
    // Parse filter parameters
    const filterParams = OfficerFilterSchema.parse({
      department: searchParams.get('department') || undefined,
      hierarchy_level: searchParams.get('hierarchy_level') ? parseInt(searchParams.get('hierarchy_level')!) : undefined,
      search: searchParams.get('search') || undefined
    })
    
    // Build query
    let query = supabase
      .from('officers')
      .select('*', { count: 'exact' })
    
    // Apply filters
    if (filterParams.department) {
      query = query.eq('department', filterParams.department)
    }
    
    if (filterParams.hierarchy_level !== undefined) {
      query = query.eq('hierarchy_level', filterParams.hierarchy_level)
    }
    
    if (filterParams.search) {
      query = query.or(`name.ilike.%${filterParams.search}%,position.ilike.%${filterParams.search}%,department.ilike.%${filterParams.search}%`)
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
    console.error('Officers API error:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to fetch officers data'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Insert new officer
    const { data, error } = await supabase
      .from('officers')
      .insert(body)
      .select()
      .single()
    
    if (error) throw error
    
    const response: ApiResponse = {
      success: true,
      data,
      message: 'Officer created successfully'
    }
    
    return NextResponse.json(response, { status: 201 })
    
  } catch (error) {
    console.error('Officer creation API error:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to create officer'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}