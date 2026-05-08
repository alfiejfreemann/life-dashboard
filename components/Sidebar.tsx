'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Dumbbell, TrendingUp, Apple,
  Heart, DollarSign, Zap, Target, Activity,
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
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-60 flex-col bg-black border-r border-[#111] z-40">

        {/* Logo */}
        <div className="p-5 border-b border-[#111]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <Activity className="w-3.5 h-3.5 text-black" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Alfie Freeman</p>
              <p className="text-[11px] text-neutral-700">Command Centre</p>
            </div>
          </Link>
        </div>

        {/* Race countdown */}
        <div className="mx-4 mt-4 p-3.5 rounded-xl border border-[#1a1a1a] bg-[#080808]">
          <p className="text-[10px] text-neutral-600 font-medium uppercase tracking-wider">Hyrox Sydney</p>
          <HyroxCountdown />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${active
                    ? 'bg-white text-black'
                    : 'text-neutral-600 hover:text-neutral-300 hover:bg-[#0f0f0f]'
                  }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Goals mini */}
        <div className="p-4 border-t border-[#111]">
          <p className="text-[10px] text-neutral-700 mb-3 uppercase tracking-wider">Goals</p>
          <div className="space-y-2.5">
            <GoalMini label="Sub-60 Hyrox" pct={42} />
            <GoalMini label="Sub-10% Body Fat" pct={28} />
            <GoalMini label="£10k/mo Income" pct={15} />
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-[#111] flex items-center justify-around px-2 py-2">
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
  const diff = Math.ceil((new Date('2026-07-19').getTime() - new Date().getTime()) / 86400000)
  const weeks = Math.floor(diff / 7)
  const days = diff % 7
  return (
    <div className="mt-1.5">
      <p className="text-white font-bold text-xl leading-tight tracking-tight">
        {weeks}<span className="text-neutral-500 text-base">w </span>
        {days}<span className="text-neutral-500 text-base">d</span>
      </p>
      <p className="text-[11px] text-neutral-700 mt-0.5">19 July · sub-60 target</p>
    </div>
  )
}

function GoalMini({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[11px] text-neutral-700">{label}</span>
        <span className="text-[11px] text-neutral-600">{pct}%</span>
      </div>
      <div className="h-px bg-[#1a1a1a]">
        <div className="h-full bg-neutral-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
