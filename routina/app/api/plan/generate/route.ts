import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateRoutineWithGemini } from '@/lib/gemini'

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
    const { date } = body

    // Get user preferences
    const preferences = await prisma.preferences.findFirst({
      where: { userId: user.id }
    })

    if (!preferences) {
      return NextResponse.json({ error: 'Please complete onboarding first' }, { status: 400 })
    }

    // Check if plan already exists for this date
    const existingPlan = await prisma.plan.findFirst({
      where: {
        userId: user.id,
        date: new Date(date)
      }
    })

    if (existingPlan) {
      return NextResponse.json({ error: 'Plan already exists for this date' }, { status: 409 })
    }

    // Generate routine using Gemini
    const blocks = await generateRoutineWithGemini({
      role: preferences.role || 'professional',
      goals: (preferences.goals as string[]) || [],
      constraints: (preferences.constraintsList as string[]) || [],
      focusAreas: (preferences.focusAreas as string[]) || [],
      wakeTime: preferences.wakeTime || '06:00',
      sleepTime: preferences.sleepTime || '22:00',
      timezone: preferences.timezone || 'UTC'
    })

    // Save plan to database
    const plan = await prisma.plan.create({
      data: {
        userId: user.id,
        date: new Date(date),
        blocks: blocks as any,
        status: 'active',
        completionRate: 0
      }
    })

    return NextResponse.json({ data: { plan, blocks } })
  } catch (error: unknown) {
    console.error('Generate plan error:', error)
    return NextResponse.json(
      { error: 'Failed to generate plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
