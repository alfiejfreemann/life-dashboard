'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Dumbbell,
  TrendingUp,
  Apple,
  Heart,
  DollarSign,
  Zap,
  Target,
  ChevronRight,
  Activity,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Command Center', icon: LayoutDashboard },
  { href: '/training', label: 'Hyrox Training', icon: Zap },
  { href: '/body', label: 'Body Composition', icon: TrendingUp },
  { href: '/strength', label: 'Strength', icon: Dumbbell },
  { href: '/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/recovery', label: 'Recovery', icon: Heart },
  { href: '/finance', label: 'Finance', icon: DollarSign },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-64 flex-col bg-dark-800 border-r border-dark-600 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-dark-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-cyan to-blue-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Alfie</p>
              <p className="text-xs text-gray-500">Life Dashboard</p>
            </div>
          </div>
        </div>

        {/* Race countdown */}
        <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-r from-brand-cyan/10 to-blue-500/10 border border-brand-cyan/20">
          <p className="text-xs text-brand-cyan font-semibold uppercase tracking-wider">Hyrox Sydney</p>
          <HyroxCountdown />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20'
                    : 'text-gray-500 hover:text-white hover:bg-dark-600'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3 h-3" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom goals summary */}
        <div className="p-4 border-t border-dark-600">
          <p className="text-xs text-gray-600 mb-3 uppercase tracking-wider font-medium">Active Goals</p>
          <div className="space-y-2">
            <GoalMini label="Sub-60 Hyrox" pct={42} color="bg-brand-cyan" />
            <GoalMini label="Sub 10% BF" pct={28} color="bg-brand-green" />
            <GoalMini label="£10k/mo Online" pct={15} color="bg-brand-orange" />
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-800 border-t border-dark-600 flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
                active ? 'text-brand-cyan' : 'text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

function HyroxCountdown() {
  const raceDate = new Date('2026-07-19')
  const today = new Date()
  const diff = Math.ceil((raceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(diff / 7)
  const days = diff % 7

  return (
    <div className="mt-1">
      <p className="text-white font-bold text-lg">
        {diff > 0 ? (
          <>
            <span className="text-brand-cyan">{weeks}w</span>
            <span className="text-gray-400 text-sm"> {days}d</span>
          </>
        ) : (
          <span className="text-brand-green">Race day!</span>
        )}
      </p>
      <p className="text-xs text-gray-500">19 July 2026 · Target: sub-60</p>
    </div>
  )
}

function GoalMini({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs text-gray-400">{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-dark-400 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
