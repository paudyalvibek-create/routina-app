import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { habitId, date, completed, notes } = body

    // Check if checkin already exists
    const existing = await prisma.checkin.findFirst({
      where: {
        habitId,
        date: new Date(date)
      }
    })

    let checkin
    if (existing) {
      checkin = await prisma.checkin.update({
        where: { id: existing.id },
        data: { completed, notes }
      })
    } else {
      checkin = await prisma.checkin.create({
        data: {
          habitId,
          userId: user.id,
          date: new Date(date),
          completed,
          notes
        }
      })
    }

    return NextResponse.json({ data: checkin })
  } catch (error: unknown) {
    console.error('Habit checkin error:', error)
    return NextResponse.json(
      { error: 'Failed to log habit checkin', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const habitId = searchParams.get('habitId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: Record<string, unknown> = { userId: user.id }
    
    if (habitId) {
      where.habitId = habitId
    }
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const checkins = await prisma.checkin.findMany({
      where,
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ data: checkins })
  } catch (error: unknown) {
    console.error('Get checkins error:', error)
    return NextResponse.json(
      { error: 'Failed to get checkins', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
