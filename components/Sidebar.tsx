'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Dumbbell, TrendingUp, Apple,
  Heart, DollarSign, Zap, Target, ChevronRight, Activity,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Command Centre', icon: LayoutDashboard },
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
      {/* Desktop */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-64 flex-col bg-[#050505] border-r border-[#141414] z-40">
        {/* Logo */}
        <div className="p-5 border-b border-[#141414]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Activity className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Alfie Freeman</p>
              <p className="text-xs text-neutral-700">Command Centre</p>
            </div>
          </Link>
        </div>

        {/* Race countdown */}
        <div className="mx-4 mt-4 p-3.5 rounded-xl bg-[#0a0f1e] border border-blue-950">
          <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">Hyrox Sydney</p>
          <HyroxCountdown />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${active
                    ? 'bg-[#0f0f0f] text-white border border-[#1f1f1f]'
                    : 'text-neutral-600 hover:text-neutral-300 hover:bg-[#0a0a0a]'
                  }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-500' : ''}`} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3 h-3 text-neutral-700" />}
              </Link>
            )
          })}
        </nav>

        {/* Goals */}
        <div className="p-4 border-t border-[#141414]">
          <p className="text-[10px] text-neutral-700 mb-3 uppercase tracking-wider font-medium">Goals</p>
          <div className="space-y-2.5">
            <GoalMini label="Sub-60 Hyrox" pct={42} />
            <GoalMini label="Sub-10% Body Fat" pct={28} />
            <GoalMini label="£10k/mo Income" pct={15} />
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050505] border-t border-[#141414] flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all
                ${active ? 'text-white' : 'text-neutral-700'}`}>
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
  const diff = Math.ceil((raceDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(diff / 7)
  const days = diff % 7
  return (
    <div className="mt-1.5">
      <p className="text-white font-bold text-lg leading-tight">
        <span className="text-blue-400">{weeks}w</span>
        <span className="text-neutral-600 text-sm"> {days}d</span>
      </p>
      <p className="text-xs text-neutral-700 mt-0.5">19 July 2026 · sub-60 target</p>
    </div>
  )
}

function GoalMini({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-neutral-700">{label}</span>
        <span className="text-xs text-neutral-600">{pct}%</span>
      </div>
      <div className="h-px rounded-full bg-[#1a1a1a] overflow-hidden">
        <div className="h-full rounded-full bg-blue-700 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
