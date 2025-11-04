import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateRoutineWithGemini, RoutineBlock } from '@/lib/gemini'
import { getCurrentTime, parseTimeToMinutes } from '@/lib/utils'

export async function PUT(req: NextRequest) {
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

    // Get existing plan
    const existingPlan = await prisma.plan.findFirst({
      where: {
        userId: user.id,
        date: new Date(date)
      }
    })

    if (!existingPlan) {
      return NextResponse.json({ error: 'Plan not found for this date' }, { status: 404 })
    }

    // Get user preferences
    const preferences = await prisma.preferences.findFirst({
      where: { userId: user.id }
    })

    if (!preferences) {
      return NextResponse.json({ error: 'Preferences not found' }, { status: 400 })
    }

    // Get current time and filter completed blocks
    const currentTime = getCurrentTime()
    const currentMinutes = parseTimeToMinutes(currentTime)
    
    const oldBlocks = existingPlan.blocks as unknown as RoutineBlock[]
    const completedBlocks = oldBlocks.filter(
      (block) => block.completed || parseTimeToMinutes(block.endTime) <= currentMinutes
    )
    const completedActivities = completedBlocks.map((b) => b.activity)

    // Generate new routine from current time
    const newBlocks = await generateRoutineWithGemini({
      role: preferences.role || 'professional',
      goals: (preferences.goals as string[]) || [],
      constraints: (preferences.constraintsList as string[]) || [],
      focusAreas: (preferences.focusAreas as string[]) || [],
      wakeTime: preferences.wakeTime || '06:00',
      sleepTime: preferences.sleepTime || '22:00',
      timezone: preferences.timezone || 'UTC',
      currentTime,
      completedBlocks: completedActivities
    })

    // Merge completed blocks with new blocks
    const mergedBlocks = [
      ...completedBlocks,
      ...newBlocks.filter((block) => parseTimeToMinutes(block.startTime) >= currentMinutes)
    ]

    // Calculate completion rate
    const completedCount = mergedBlocks.filter((b) => b.completed).length
    const completionRate = (completedCount / mergedBlocks.length) * 100

    // Update plan
    const updatedPlan = await prisma.plan.update({
      where: { id: existingPlan.id },
      data: {
        blocks: mergedBlocks as any,
        completionRate: Math.round(completionRate * 100) / 100
      }
    })

    return NextResponse.json({ data: { plan: updatedPlan, blocks: mergedBlocks } })
  } catch (error: unknown) {
    console.error('Replan error:', error)
    return NextResponse.json(
      { error: 'Failed to replan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
