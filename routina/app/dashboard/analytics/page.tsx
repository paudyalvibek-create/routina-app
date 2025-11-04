'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TrendingUp, Calendar, Target, Flame } from 'lucide-react'

export default function AnalyticsPage() {
  const [authToken, setAuthToken] = useState<string>('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setAuthToken(session.access_token)
      }
    })
  }, [])

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', 30],
    queryFn: async () => {
      if (!authToken) return null
      const res = await fetch('/api/analytics/summary?days=30', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      const data = await res.json()
      return data.data
    },
    enabled: !!authToken
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your progress and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Flame className="w-6 h-6 text-orange-600" />}
          label="Current Streak"
          value={`${analytics?.currentStreak || 0} days`}
          bgColor="bg-orange-50"
        />
        <StatCard
          icon={<Target className="w-6 h-6 text-green-600" />}
          label="Avg Completion"
          value={`${Math.round(analytics?.averageCompletion || 0)}%`}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          label="Total Plans"
          value={analytics?.totalPlans || 0}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          label="Active Habits"
          value={analytics?.habitStats?.length || 0}
          bgColor="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Category Distribution</h3>
            <p className="text-sm text-gray-600">Completed activities by category</p>
          </CardHeader>
          <CardContent>
            {analytics?.categoryStats && Object.keys(analytics.categoryStats).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(analytics.categoryStats as Record<string, number>)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getCategoryDotColor(category)}`} />
                        <span className="capitalize text-gray-700">{category}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{count as number}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Habit Performance</h3>
            <p className="text-sm text-gray-600">Your habit streaks and completion rates</p>
          </CardHeader>
          <CardContent>
            {analytics?.habitStats && analytics.habitStats.length > 0 ? (
              <div className="space-y-4">
                {analytics.habitStats.map((habit: {
                  habitId: string
                  habitName: string
                  currentStreak: number
                  totalCheckins: number
                  completionRate: number
                }) => (
                  <div key={habit.habitId} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{habit.habitName}</h4>
                      <span className="text-sm text-gray-600">
                        {Math.round(habit.completionRate)}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Streak: {habit.currentStreak} days</span>
                      <span>Total: {habit.totalCheckins}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${habit.completionRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No habits tracked yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-sm text-gray-600">Your recent routine completions</p>
        </CardHeader>
        <CardContent>
          {analytics?.recentPlans && analytics.recentPlans.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentPlans.map((plan: {
                id: string
                date: string
                completionRate: number
                status: string
              }) => (
                <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(plan.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">{plan.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {Math.round(Number(plan.completionRate) || 0)}%
                    </p>
                    <p className="text-sm text-gray-600">completed</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </CardContent>
      </Card>
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
          <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getCategoryDotColor(category: string): string {
  const colors: Record<string, string> = {
    work: 'bg-blue-600',
    study: 'bg-purple-600',
    fitness: 'bg-green-600',
    personal: 'bg-yellow-600',
    break: 'bg-gray-600',
    sleep: 'bg-indigo-600'
  }
  return colors[category] || 'bg-gray-600'
}
