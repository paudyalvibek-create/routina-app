'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle2, Plus, Trash2, Circle } from 'lucide-react'

interface Habit {
  id: string
  name: string
  description: string | null
  targetFrequency: string
  category: string | null
}

export default function HabitsPage() {
  const queryClient = useQueryClient()
  const [authToken, setAuthToken] = useState<string>('')
  const [showNewHabit, setShowNewHabit] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    targetFrequency: 'daily',
    category: ''
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setAuthToken(session.access_token)
      }
    })
  }, [])

  const { data: habits, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      if (!authToken) return []
      const res = await fetch('/api/habit', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      const data = await res.json()
      return data.data || []
    },
    enabled: !!authToken
  })

  const { data: checkins } = useQuery({
    queryKey: ['checkins', new Date().toISOString().split('T')[0]],
    queryFn: async () => {
      if (!authToken) return []
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/habit/checkin?startDate=${today}&endDate=${today}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      const data = await res.json()
      return data.data || []
    },
    enabled: !!authToken
  })

  const createHabitMutation = useMutation({
    mutationFn: async (habitData: typeof newHabit) => {
      const res = await fetch('/api/habit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(habitData)
      })
      if (!res.ok) throw new Error('Failed to create habit')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      setShowNewHabit(false)
      setNewHabit({ name: '', description: '', targetFrequency: 'daily', category: '' })
    }
  })

  const deleteHabitMutation = useMutation({
    mutationFn: async (habitId: string) => {
      const res = await fetch(`/api/habit?id=${habitId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      })
      if (!res.ok) throw new Error('Failed to delete habit')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    }
  })

  const checkinMutation = useMutation({
    mutationFn: async ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch('/api/habit/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          habitId,
          date: today,
          completed,
          notes: ''
        })
      })
      if (!res.ok) throw new Error('Failed to log checkin')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkins'] })
    }
  })

  const isHabitCheckedToday = (habitId: string): boolean => {
    return checkins?.some((c: { habitId: string; completed: boolean }) => c.habitId === habitId && c.completed) || false
  }

  const handleCreateHabit = () => {
    if (!newHabit.name.trim()) return
    createHabitMutation.mutate(newHabit)
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
          <p className="text-gray-600 mt-1">Build consistency with daily habits</p>
        </div>
        <Button onClick={() => setShowNewHabit(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Habit
        </Button>
      </div>

      {showNewHabit && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Create New Habit</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Habit Name"
              placeholder="e.g., Morning Meditation"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            />
            <Input
              label="Description (optional)"
              placeholder="What does this habit involve?"
              value={newHabit.description}
              onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
            />
            <Select
              label="Target Frequency"
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: '3x-week', label: '3x per week' },
                { value: '5x-week', label: '5x per week' }
              ]}
              value={newHabit.targetFrequency}
              onChange={(e) => setNewHabit({ ...newHabit, targetFrequency: e.target.value })}
            />
            <Input
              label="Category (optional)"
              placeholder="e.g., Health, Productivity"
              value={newHabit.category}
              onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
            />
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowNewHabit(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleCreateHabit}
                disabled={createHabitMutation.isPending}
                className="flex-1"
              >
                {createHabitMutation.isPending ? 'Creating...' : 'Create Habit'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits?.map((habit: Habit) => {
          const isChecked = isHabitCheckedToday(habit.id)
          return (
            <Card key={habit.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                    {habit.description && (
                      <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
                    )}
                    <div className="mt-2 flex items-center space-x-2">
                      {habit.category && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {habit.category}
                        </span>
                      )}
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {habit.targetFrequency}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHabitMutation.mutate(habit.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => checkinMutation.mutate({ habitId: habit.id, completed: !isChecked })}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    isChecked
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={checkinMutation.isPending}
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                  <span className="font-medium">
                    {isChecked ? 'Completed Today' : 'Mark Complete'}
                  </span>
                </button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {habits?.length === 0 && !showNewHabit && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Habits Yet</h3>
            <p className="text-gray-600 mb-6">Start building better habits today!</p>
            <Button onClick={() => setShowNewHabit(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Habit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
