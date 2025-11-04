'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
      
      if (posthogKey && posthogHost) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') posthog.debug()
          },
          capture_pageview: false,
          capture_pageleave: true
        })
      }
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}

// Analytics event tracking functions
export const analytics = {
  identify: (userId: string, traits?: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      posthog.identify(userId, traits)
    }
  },

  trackEvent: (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      posthog.capture(eventName, properties)
    }
  },

  trackPageView: () => {
    if (typeof window !== 'undefined') {
      posthog.capture('$pageview')
    }
  },

  // Specific tracking methods
  trackRoutineGenerated: (role: string, date: string) => {
    analytics.trackEvent('routine_generated', { role, date })
  },

  trackRoutineReplanned: (date: string, reason?: string) => {
    analytics.trackEvent('routine_replanned', { date, reason })
  },

  trackActivityCompleted: (activity: string, category: string) => {
    analytics.trackEvent('activity_completed', { activity, category })
  },

  trackHabitCreated: (habitName: string, frequency: string) => {
    analytics.trackEvent('habit_created', { habit_name: habitName, frequency })
  },

  trackHabitCheckin: (habitId: string, completed: boolean) => {
    analytics.trackEvent('habit_checkin', { habit_id: habitId, completed })
  },

  trackOnboardingCompleted: (role: string) => {
    analytics.trackEvent('onboarding_completed', { role })
  },

  trackSignUp: (method: string) => {
    analytics.trackEvent('user_signed_up', { method })
  },

  trackSignIn: (method: string) => {
    analytics.trackEvent('user_signed_in', { method })
  }
}
