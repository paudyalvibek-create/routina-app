import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase/server'

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
    const updates = body

    const existing = await prisma.preferences.findFirst({
      where: { userId: user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Preferences not found' }, { status: 404 })
    }

    const preferences = await prisma.preferences.update({
      where: { id: existing.id },
      data: updates
    })

    return NextResponse.json({ data: preferences })
  } catch (error: unknown) {
    console.error('Update preferences error:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
