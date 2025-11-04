import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { RoutineBlock } from '@/lib/gemini'

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
    const days = parseInt(searchParams.get('days') || '30', 10)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get all plans in date range
    const plans = await prisma.plan.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate }
      },
      orderBy: { date: 'desc' }
    })

    // Get all habits and checkins
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        checkins: {
          where: {
            date: { gte: startDate }
          }
        }
      }
    })

    // Calculate analytics
    const totalPlans = plans.length
    const averageCompletion = plans.length > 0
      ? plans.reduce((sum: number, plan: any) => sum + Number(plan.completionRate || 0), 0) / plans.length
      : 0

    // Calculate streak
    let currentStreak = 0
    let checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      const dayPlan = plans.find((p: any) => p.date.toISOString().split('T')[0] === dateStr)
      
      if (dayPlan && Number(dayPlan.completionRate) >= 70) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
      
      if (currentStreak > 365) break // Safety check
    }

    // Calculate category distribution
    const categoryStats: Record<string, number> = {}
    plans.forEach((plan: any) => {
      const blocks = plan.blocks as unknown as RoutineBlock[]
      blocks.forEach((block: RoutineBlock) => {
        if (block.completed) {
          categoryStats[block.category] = (categoryStats[block.category] || 0) + 1
        }
      })
    })

    // Calculate habit streaks
    const habitStats = habits.map((habit: any) => {
      const completedDates = habit.checkins
        .filter((c: any) => c.completed)
        .map((c: any) => c.date.toISOString().split('T')[0])
        .sort()

      let habitStreak = 0
      let checkHabitDate = new Date()
      checkHabitDate.setHours(0, 0, 0, 0)

      while (true) {
        const dateStr = checkHabitDate.toISOString().split('T')[0]
        if (completedDates.includes(dateStr)) {
          habitStreak++
          checkHabitDate.setDate(checkHabitDate.getDate() - 1)
        } else {
          break
        }
        
        if (habitStreak > 365) break
      }

      return {
        habitId: habit.id,
        habitName: habit.name,
        currentStreak: habitStreak,
        totalCheckins: habit.checkins.filter((c: any) => c.completed).length,
        completionRate: habit.checkins.length > 0
          ? (habit.checkins.filter((c: any) => c.completed).length / habit.checkins.length) * 100
          : 0
      }
    })

    return NextResponse.json({
      data: {
        totalPlans,
        averageCompletion: Math.round(averageCompletion * 100) / 100,
        currentStreak,
        categoryStats,
        habitStats,
        recentPlans: plans.slice(0, 7)
      }
    })
  } catch (error: unknown) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to get analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
