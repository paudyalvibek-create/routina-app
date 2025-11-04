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
    const { role, timezone, wakeTime, sleepTime, goals, constraints, focusAreas, routineTypes } = body

    // Check if preferences already exist
    const existing = await prisma.preferences.findFirst({
      where: { userId: user.id }
    })

    let preferences
    if (existing) {
      // Update existing preferences
      preferences = await prisma.preferences.update({
        where: { id: existing.id },
        data: {
          role,
          timezone,
          wakeTime,
          sleepTime,
          goals: goals || [],
          constraintsList: constraints || [],
          focusAreas: focusAreas || [],
          routineTypes: routineTypes || []
        }
      })
    } else {
      // Create new preferences
      preferences = await prisma.preferences.create({
        data: {
          userId: user.id,
          role,
          timezone,
          wakeTime,
          sleepTime,
          goals: goals || [],
          constraintsList: constraints || [],
          focusAreas: focusAreas || [],
          routineTypes: routineTypes || []
        }
      })
    }

    return NextResponse.json({ data: preferences })
  } catch (error: unknown) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to save preferences', details: error instanceof Error ? error.message : 'Unknown error' },
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

    const preferences = await prisma.preferences.findFirst({
      where: { userId: user.id }
    })

    if (!preferences) {
      return NextResponse.json({ data: null })
    }

    return NextResponse.json({ data: preferences })
  } catch (error: unknown) {
    console.error('Get preferences error:', error)
    return NextResponse.json(
      { error: 'Failed to get preferences', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
