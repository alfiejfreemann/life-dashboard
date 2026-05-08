'use client'

import Link from 'next/link'
import { ArrowRight, Activity } from 'lucide-react'
import { useEffect, useState } from 'react'

function useCountdown() {
  const raceDate = new Date('2026-07-19T00:00:00')
  const [diff, setDiff] = useState(() => {
    const now = new Date()
    return Math.max(0, Math.ceil((raceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  })
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date()
      setDiff(Math.max(0, Math.ceil((raceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))))
    }, 60000)
    return () => clearInterval(t)
  }, [])
  return diff
}

const STATS = [
  { label: 'Days to Hyrox Sydney', value: null, isCountdown: true, sub: '19 July 2026 · Sub-60 target' },
  { label: 'Current Weight', value: '80.2', unit: 'kg', sub: '↓ 2.2kg · Target 74kg' },
  { label: 'Body Fat', value: '14.2', unit: '%', sub: 'Target sub-10%' },
  { label: 'Online Income', value: '£1,450', unit: '/mo', sub: 'Target £10,000/mo' },
]

const MODULES = [
  'Hyrox Training', 'Body Composition', 'Strength', 'Nutrition', 'Recovery', 'Finance & Career',
]

export default function Landing() {
  const days = useCountdown()
  const weeks = Math.floor(days / 7)
  const rem = days % 7

  return (
    <div className="min-h-screen bg-black flex flex-col">

      {/* Faint vignette */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #000 100%)' }}
      />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 pt-8 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <Activity className="w-4 h-4 text-black" />
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">ALFIE FREEMAN</span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors duration-200"
        >
          Enter <ArrowRight className="w-4 h-4" />
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center animate-fade-in">

        {/* Label */}
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-600 mb-6">
          Personal Command Centre
        </p>

        {/* Main heading */}
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-4">
          Every Day<br />
          <span className="text-neutral-700">Counts.</span>
        </h1>

        {/* Sub */}
        <p className="text-neutral-500 text-sm md:text-base max-w-sm mt-4 leading-relaxed">
          Your data. Your goals. Your exact next move — every single morning.
        </p>

        {/* Divider */}
        <div className="w-px h-10 bg-neutral-800 my-8" />

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl mb-10">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 text-left hover:border-[#2a2a2a] transition-colors duration-300"
            >
              <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-2">{s.label}</p>
              {s.isCountdown ? (
                <p className="text-2xl font-bold text-white tracking-tight">
                  {weeks}<span className="text-neutral-500 text-lg">w</span>{' '}
                  {rem}<span className="text-neutral-500 text-lg">d</span>
                </p>
              ) : (
                <p className="text-2xl font-bold text-white tracking-tight">
                  {s.value}<span className="text-neutral-500 text-base">{s.unit}</span>
                </p>
              )}
              <p className="text-[11px] text-neutral-600 mt-1.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="group flex items-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-2xl text-sm
            hover:bg-neutral-100 transition-all duration-200 active:scale-95"
        >
          Open Dashboard
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>

        {/* Module list */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-8">
          {MODULES.map((m, i) => (
            <span key={m} className="flex items-center gap-4 text-xs text-neutral-700">
              {m}
              {i < MODULES.length - 1 && <span className="w-px h-3 bg-neutral-800" />}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-6 flex items-center justify-between">
        <p className="text-xs text-neutral-800">Built for Alfie · {new Date().getFullYear()}</p>
        <p className="text-xs text-neutral-800">Hyrox Sydney · July 2026</p>
      </footer>
    </div>
  )
}
