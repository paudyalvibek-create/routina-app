'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { RoutineBlock } from '@/lib/gemini'
import { formatTime } from '@/lib/utils'
import { CheckCircle2, Circle, Calendar, RefreshCw, Sparkles } from 'lucide-react'
import { format } from 'date-fns'

export default function RoutinePage() {
  const queryClient = useQueryClient()
  const [authToken, setAuthToken] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setAuthToken(session.access_token)
      }
    })
  }, [])

  const { data: plan, isLoading } = useQuery({
    queryKey: ['plan', selectedDate],
    queryFn: async () => {
      if (!authToken) return null
      const res = await fetch(`/api/plan/${selectedDate}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      const data = await res.json()
      return data.data
    },
    enabled: !!authToken
  })

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ date: selectedDate })
      })
      if (!res.ok) throw new Error('Failed to generate routine')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', selectedDate] })
    }
  })

  const replanMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/plan/replan', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ date: selectedDate })
      })
      if (!res.ok) throw new Error('Failed to replan')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', selectedDate] })
    }
  })

  const updateBlockMutation = useMutation({
    mutationFn: async (updatedBlocks: RoutineBlock[]) => {
      const res = await fetch(`/api/plan/${selectedDate}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ blocks: updatedBlocks })
      })
      if (!res.ok) throw new Error('Failed to update block')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', selectedDate] })
    }
  })

  const toggleBlock = (blockId: string) => {
    if (!plan) return
    const blocks = plan.blocks as unknown as RoutineBlock[]
    const updatedBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, completed: !block.completed } : block
    )
    updateBlockMutation.mutate(updatedBlocks)
  }

  const isToday = selectedDate === new Date().toISOString().split('T')[0]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Routine</h1>
          <p className="text-gray-600 mt-1">Plan and track your day</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {!plan ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Routine Yet</h3>
            <p className="text-gray-600 mb-6">
              Generate an AI-powered routine for {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </p>
            <Button
              size="lg"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? 'Generating...' : 'Generate Routine'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Completion: {Math.round(Number(plan.completionRate) || 0)}%
                  </p>
                </div>
                {isToday && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => replanMutation.mutate()}
                    disabled={replanMutation.isPending}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {replanMutation.isPending ? 'Replanning...' : 'Replan Day'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {(plan.blocks as unknown as RoutineBlock[]).map((block) => (
                  <div
                    key={block.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      block.completed ? 'bg-green-50' : ''
                    }`}
                    onClick={() => toggleBlock(block.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {block.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-semibold ${block.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {block.activity}
                          </h4>
                          <span className={`text-sm ${block.completed ? 'text-gray-400' : 'text-gray-600'} ml-2 flex-shrink-0`}>
                            {formatTime(block.startTime)} - {formatTime(block.endTime)}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${block.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                          {block.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(block.category)}`}>
                            {block.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(block.priority)}`}>
                            {block.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    />
  )
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    work: 'bg-blue-100 text-blue-700',
    study: 'bg-purple-100 text-purple-700',
    fitness: 'bg-green-100 text-green-700',
    personal: 'bg-yellow-100 text-yellow-700',
    break: 'bg-gray-100 text-gray-700',
    sleep: 'bg-indigo-100 text-indigo-700'
  }
  return colors[category] || 'bg-gray-100 text-gray-700'
}

function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-orange-100 text-orange-700',
    low: 'bg-green-100 text-green-700'
  }
  return colors[priority] || 'bg-gray-100 text-gray-700'
}
