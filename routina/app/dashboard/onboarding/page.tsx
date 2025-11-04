'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function OnboardingPage() {
  const router = useRouter()
  const [authToken, setAuthToken] = useState<string>('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    role: 'professional',
    timezone: 'America/New_York',
    wakeTime: '06:00',
    sleepTime: '22:00',
    goals: '',
    constraints: '',
    focusAreas: '',
    routineTypes: ''
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setAuthToken(session.access_token)
      }
    })
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...formData,
          goals: formData.goals.split(',').map((g) => g.trim()).filter(Boolean),
          constraints: formData.constraints.split(',').map((c) => c.trim()).filter(Boolean),
          focusAreas: formData.focusAreas.split(',').map((f) => f.trim()).filter(Boolean),
          routineTypes: formData.routineTypes.split(',').map((r) => r.trim()).filter(Boolean)
        })
      })

      if (!res.ok) {
        throw new Error('Failed to save preferences')
      }

      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tell us about yourself</h3>
            <Select
              label="What best describes you?"
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
            <Button type="button" onClick={() => setStep(2)} className="w-full">
              Next
            </Button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Schedule</h3>
            <Input
              type="time"
              label="What time do you usually wake up?"
              value={formData.wakeTime}
              onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
            />
            <Input
              type="time"
              label="What time do you usually go to sleep?"
              value={formData.sleepTime}
              onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })}
            />
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full">
                Back
              </Button>
              <Button type="button" onClick={() => setStep(3)} className="w-full">
                Next
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Goals & Preferences</h3>
            <Input
              label="Goals (comma-separated)"
              placeholder="e.g., Exercise daily, Learn new skill, Read more"
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
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-full">
                Back
              </Button>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Complete Setup'}
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Setup Your Profile</h2>
          <p className="text-gray-600 mt-2">Step {step} of 3</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {renderStep()}
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
