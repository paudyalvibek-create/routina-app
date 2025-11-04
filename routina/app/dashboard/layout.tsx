'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { Home, Calendar, CheckSquare, BarChart3, Settings, LogOut } from 'lucide-react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAuthStore()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                Routina
              </Link>
              <div className="hidden md:flex space-x-4">
                <NavLink href="/dashboard" icon={<Home className="w-4 h-4" />}>
                  Dashboard
                </NavLink>
                <NavLink href="/dashboard/routine" icon={<Calendar className="w-4 h-4" />}>
                  Routine
                </NavLink>
                <NavLink href="/dashboard/habits" icon={<CheckSquare className="w-4 h-4" />}>
                  Habits
                </NavLink>
                <NavLink href="/dashboard/analytics" icon={<BarChart3 className="w-4 h-4" />}>
                  Analytics
                </NavLink>
                <NavLink href="/dashboard/settings" icon={<Settings className="w-4 h-4" />}>
                  Settings
                </NavLink>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}

function NavLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}
