'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle2, Calendar, TrendingUp, Target } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [authToken, setAuthToken] = useState<string>('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setAuthToken(session.access_token)
      }
    })
  }, [])

  const { data: preferences, isLoading: prefsLoading } = useQuery({
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

  const { data: todayPlan } = useQuery({
    queryKey: ['plan', new Date().toISOString().split('T')[0]],
    queryFn: async () => {
      if (!authToken) return null
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/plan/${today}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      const data = await res.json()
      return data.data
    },
    enabled: !!authToken && !!preferences
  })

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      if (!authToken) return null
      const res = await fetch('/api/analytics/summary?days=30', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      const data = await res.json()
      return data.data
    },
    enabled: !!authToken && !!preferences
  })

  if (prefsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!preferences) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Welcome to Routina!</h2>
            <p className="text-gray-600 mt-2">
              Let's set up your personalized routine. This will help us generate the perfect daily schedule for you.
            </p>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={() => router.push('/dashboard/onboarding')}>
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-1">Here's your routine overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Calendar className="w-5 h-5 text-blue-600" />}
          label="Current Streak"
          value={`${analytics?.currentStreak || 0} days`}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<Target className="w-5 h-5 text-green-600" />}
          label="Completion Rate"
          value={`${Math.round(analytics?.averageCompletion || 0)}%`}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-purple-600" />}
          label="Total Plans"
          value={analytics?.totalPlans || 0}
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-orange-600" />}
          label="Active Habits"
          value={analytics?.habitStats?.length || 0}
          bgColor="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Today's Routine</h3>
          </CardHeader>
          <CardContent>
            {todayPlan ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Completion: {Math.round(Number(todayPlan.completionRate) || 0)}%
                </p>
                <Link href="/dashboard/routine">
                  <Button variant="outline" className="w-full">
                    View Full Routine
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">No routine generated for today yet.</p>
                <Link href="/dashboard/routine">
                  <Button className="w-full">Generate Today's Routine</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/routine">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                View Routine
              </Button>
            </Link>
            <Link href="/dashboard/habits">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Track Habits
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  bgColor
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  bgColor: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${bgColor}`}>{icon}</div>
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
