'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [authToken, setAuthToken] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    role: 'professional',
    timezone: 'America/New_York',
    wakeTime: '06:00',
    sleepTime: '22:00',
    goals: '',
    constraints: '',
    focusAreas: ''
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setAuthToken(session.access_token)
      }
    })
  }, [])

  const { data: preferences } = useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      if (!authToken) return null
      const res = await fetch('/api/onboarding', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      const data = await res.json()
      return data.data
    },
    enabled: !!authToken
  })

  useEffect(() => {
    if (preferences) {
      setFormData({
        role: preferences.role || 'professional',
        timezone: preferences.timezone || 'America/New_York',
        wakeTime: preferences.wakeTime || '06:00',
        sleepTime: preferences.sleepTime || '22:00',
        goals: Array.isArray(preferences.goals) ? preferences.goals.join(', ') : '',
        constraints: Array.isArray(preferences.constraintsList)
          ? preferences.constraintsList.join(', ')
          : '',
        focusAreas: Array.isArray(preferences.focusAreas)
          ? preferences.focusAreas.join(', ')
          : ''
      })
    }
  }, [preferences])

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...data,
          goals: data.goals.split(',').map((g) => g.trim()).filter(Boolean),
          constraintsList: data.constraints.split(',').map((c) => c.trim()).filter(Boolean),
          focusAreas: data.focusAreas.split(',').map((f) => f.trim()).filter(Boolean)
        })
      })
      if (!res.ok) throw new Error('Failed to update preferences')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] })
      setSuccess('Settings updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    },
    onError: (err: Error) => {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    }
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your preferences and account</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Profile Settings</h3>
          <p className="text-sm text-gray-600">Update your routine preferences</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Role"
              options={[
                { value: 'student', label: 'Student' },
                { value: 'professional', label: 'Professional' },
                { value: 'creator', label: 'Creator/Artist' },
                { value: 'fitness', label: 'Fitness Enthusiast' }
              ]}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />

            <Select
              label="Timezone"
              options={[
                { value: 'America/New_York', label: 'Eastern Time (ET)' },
                { value: 'America/Chicago', label: 'Central Time (CT)' },
                { value: 'America/Denver', label: 'Mountain Time (MT)' },
                { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                { value: 'UTC', label: 'UTC' }
              ]}
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="time"
                label="Wake Time"
                value={formData.wakeTime}
                onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
              />
              <Input
                type="time"
                label="Sleep Time"
                value={formData.sleepTime}
                onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })}
              />
            </div>

            <Input
              label="Goals (comma-separated)"
              placeholder="e.g., Exercise daily, Learn new skill"
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
            />

            <Input
              label="Constraints (comma-separated)"
              placeholder="e.g., Meetings 9-11am, No work after 6pm"
              value={formData.constraints}
              onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
            />

            <Input
              label="Focus Areas (comma-separated)"
              placeholder="e.g., Health, Career, Learning"
              value={formData.focusAreas}
              onChange={(e) => setFormData({ ...formData, focusAreas: e.target.value })}
            />

            {success && (
              <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>
            )}

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            <Button type="submit" disabled={updateMutation.isPending} size="lg">
              {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
