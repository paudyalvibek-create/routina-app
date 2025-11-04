import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { RoutineBlock } from '@/lib/gemini'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
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

    const { date } = await params

    const plan = await prisma.plan.findFirst({
      where: {
        userId: user.id,
        date: new Date(date)
      }
    })

    if (!plan) {
      return NextResponse.json({ data: null })
    }

    return NextResponse.json({ data: plan })
  } catch (error: unknown) {
    console.error('Get plan error:', error)
    return NextResponse.json(
      { error: 'Failed to get plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
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

    const { date } = await params
    const body = await req.json()
    const { blocks } = body

    const plan = await prisma.plan.findFirst({
      where: {
        userId: user.id,
        date: new Date(date)
      }
    })

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Calculate completion rate
    const completedCount = blocks.filter((b: RoutineBlock) => b.completed).length
    const completionRate = (completedCount / blocks.length) * 100

    const updatedPlan = await prisma.plan.update({
      where: { id: plan.id },
      data: {
        blocks,
        completionRate: Math.round(completionRate * 100) / 100
      }
    })

    return NextResponse.json({ data: updatedPlan })
  } catch (error: unknown) {
    console.error('Update plan error:', error)
    return NextResponse.json(
      { error: 'Failed to update plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
