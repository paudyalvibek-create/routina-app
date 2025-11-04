import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase/server'

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

    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ data: habits })
  } catch (error: unknown) {
    console.error('Get habits error:', error)
    return NextResponse.json(
      { error: 'Failed to get habits', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

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
    const { name, description, targetFrequency, category } = body

    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        name,
        description,
        targetFrequency,
        category
      }
    })

    return NextResponse.json({ data: habit })
  } catch (error: unknown) {
    console.error('Create habit error:', error)
    return NextResponse.json(
      { error: 'Failed to create habit', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
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
    const habitId = searchParams.get('id')

    if (!habitId) {
      return NextResponse.json({ error: 'Habit ID required' }, { status: 400 })
    }

    await prisma.habit.delete({
      where: { id: habitId, userId: user.id }
    })

    return NextResponse.json({ data: { success: true } })
  } catch (error: unknown) {
    console.error('Delete habit error:', error)
    return NextResponse.json(
      { error: 'Failed to delete habit', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
