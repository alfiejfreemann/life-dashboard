'use client'

import { useState } from 'react'
import { Plus, CheckCircle2, Circle, ArrowDown, ArrowUpRight, TrendingUp, ChevronRight } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import QuickLogModal from '@/components/QuickLogModal'
import Link from 'next/link'

const weightData = [
  { date: '1 Apr', weight: 82.4 },
  { date: '8 Apr', weight: 82.1 },
  { date: '15 Apr', weight: 81.6 },
  { date: '22 Apr', weight: 81.2 },
  { date: '29 Apr', weight: 80.8 },
  { date: '6 May', weight: 80.4 },
  { date: '8 May', weight: 80.2 },
]

const trainingWeek = [
  { day: 'M', mins: 65 }, { day: 'T', mins: 90 }, { day: 'W', mins: 45 },
  { day: 'T', mins: 75 }, { day: 'F', mins: 60 }, { day: 'S', mins: 120 }, { day: 'S', mins: 0 },
]

const HABITS = [
  'Training session done',
  'Hit 200g protein',
  '8h+ sleep',
  'Zone 2 — 30 min',
  '3L water',
  'Morning sunlight',
  'Cold shower',
  '10k steps',
]

const TODAY_FOCUS = [
  { text: 'Wall Balls + Burpee Broad Jumps — your 2 weakest Hyrox stations. 4 sets max.', tag: 'TRAINING' },
  { text: '200g protein minimum. You\'re in recomp — muscle loss is the enemy.', tag: 'NUTRITION' },
  { text: 'Zone 2 run, 30-45 min at HR 130-145. This builds your Hyrox base.', tag: 'CARDIO' },
]

const HYROX_STATIONS = [
  { name: 'Run ×8', pct: 73 }, { name: 'SkiErg', pct: 69 }, { name: 'Sled Push', pct: 65 },
  { name: 'Sled Pull', pct: 73 }, { name: 'Burpee BJ', pct: 58 }, { name: 'Row', pct: 79 },
  { name: 'Farmers', pct: 87 }, { name: 'Sandbag', pct: 62 }, { name: 'Wall Balls', pct: 58 },
]

function getDays() {
  return Math.ceil((new Date('2026-07-19').getTime() - new Date().getTime()) / 86400000)
}

function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening'
}

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p className="text-neutral-500 text-xs">{label}</p>
      <p className="text-white font-semibold mt-0.5">{payload[0].value}</p>
    </div>
  )
}

export default function Dashboard() {
  const [habits, setHabits] = useState<Record<number, boolean>>({})
  const [logType, setLogType] = useState<'workout' | 'body' | 'nutrition'>('workout')
  const [showLog, setShowLog] = useState(false)
  const days = getDays()
  const done = Object.values(habits).filter(Boolean).length
  const totalMins = trainingWeek.reduce((s, d) => s + d.mins, 0)

  const openLog = (t: 'workout' | 'body' | 'nutrition') => { setLogType(t); setShowLog(true) }

  return (
    <div className="animate-fade-in pb-24 md:pb-8">

      {/* ── TOP BAR ───────────────────────────────────── */}
      <div className="flex items-end justify-between py-6 border-b border-[#111]">
        <div>
          <p className="text-neutral-600 text-xs uppercase tracking-widest">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-2xl font-bold text-white mt-0.5">{getGreeting()}, Alfie.</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => openLog('body')} className="btn-ghost text-xs px-3 py-1.5">Log Body</button>
          <button onClick={() => openLog('workout')} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Workout
          </button>
        </div>
      </div>

      {/* ── RACE HERO ─────────────────────────────────── */}
      <div className="py-8 border-b border-[#111]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-neutral-600 uppercase tracking-widest font-medium mb-2">Hyrox Sydney · 19 July 2026</p>
            <div className="flex items-baseline gap-3">
              <span className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-none">{days}</span>
              <div>
                <p className="text-neutral-400 text-xl font-light">days</p>
                <p className="text-neutral-700 text-sm">to race</p>
              </div>
            </div>
            <p className="text-neutral-600 text-sm mt-3">
              Est. finish <span className="text-white font-semibold">68:30</span> ·
              Need <span className="text-white font-semibold">−8:31</span> ·
              Target <span className="text-white font-semibold">59:59</span>
            </p>
          </div>

          {/* Station readiness mini */}
          <div className="hidden md:block">
            <p className="text-[10px] text-neutral-700 uppercase tracking-wider mb-3">Station readiness</p>
            <div className="grid grid-cols-3 gap-1.5">
              {HYROX_STATIONS.map(s => (
                <div key={s.name} className="text-center">
                  <div className="w-10 h-10 rounded-full border border-[#1f1f1f] flex items-center justify-center mx-auto mb-1"
                    style={{ background: `conic-gradient(${s.pct >= 80 ? '#fff' : s.pct >= 65 ? '#555' : '#2a2a2a'} ${s.pct * 3.6}deg, #111 0deg)` }}>
                    <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
                      <span className="text-[9px] text-white font-bold">{s.pct}</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-neutral-600">{s.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 KEY METRICS ─────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#111]">
        {[
          { label: 'Body Weight', value: '80.2', unit: 'kg', delta: '↓ 2.2', link: '/body' },
          { label: 'Body Fat', value: '14.2', unit: '%', delta: '↓ 0.4', link: '/body' },
          { label: 'Weekly Training', value: `${totalMins}`, unit: 'min', delta: '6 sessions', link: '/training' },
          { label: 'Online Income', value: '£1,450', unit: '/mo', delta: '↑ £350', link: '/finance' },
        ].map((m, i) => (
          <Link key={m.label} href={m.link}
            className={`group p-5 hover:bg-[#080808] transition-colors duration-150 ${i < 3 ? 'border-r border-[#111]' : ''} ${i >= 2 ? 'border-t border-[#111] md:border-t-0' : ''}`}>
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-2">{m.label}</p>
            <p className="text-2xl font-bold text-white tracking-tight">
              {m.value}<span className="text-neutral-500 text-sm font-normal ml-0.5">{m.unit}</span>
            </p>
            <p className="text-xs text-neutral-600 mt-1 flex items-center gap-1">
              {m.delta}
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </Link>
        ))}
      </div>

      {/* ── TODAY'S FOCUS + HABITS ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#111]">

        {/* Focus — 2/3 width */}
        <div className="md:col-span-2 p-5 border-r border-[#111]">
          <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-4">Today's Focus</p>
          <div className="space-y-3">
            {TODAY_FOCUS.map((f, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-[10px] text-neutral-700 font-mono mt-0.5 w-5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <span className="text-[10px] text-neutral-600 font-medium uppercase tracking-wider mr-2">{f.tag}</span>
                  <p className="text-sm text-neutral-300 leading-relaxed mt-0.5">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Habits — 1/3 width */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest">Habits</p>
            <span className="text-xs text-neutral-500">{done}/{HABITS.length}</span>
          </div>
          <div className="h-px bg-[#111] mb-4">
            <div className="h-full bg-white transition-all duration-500" style={{ width: `${(done / HABITS.length) * 100}%` }} />
          </div>
          <div className="space-y-1">
            {HABITS.map((h, i) => (
              <button key={i} onClick={() => setHabits(p => ({ ...p, [i]: !p[i] }))}
                className={`w-full flex items-center gap-2.5 py-1.5 text-left transition-all duration-150
                  ${habits[i] ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'}`}>
                {habits[i]
                  ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  : <Circle className="w-3.5 h-3.5 flex-shrink-0" />}
                <span className={`text-xs ${habits[i] ? 'line-through text-neutral-500' : ''}`}>{h}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CHARTS ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#111]">
        <div className="p-5 border-r border-[#111]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest">Weight Trend</p>
            <span className="text-xs text-neutral-500 flex items-center gap-1">
              <ArrowDown className="w-3 h-3" /> −2.2 kg
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={weightData} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fff" stopOpacity={0.06} />
                  <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f0f0f" />
              <XAxis dataKey="date" tick={{ fill: '#333', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#333', fontSize: 9 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="weight" stroke="#fff" strokeWidth={1} fill="url(#wg)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-neutral-700 mt-2">Goal: 74 kg @ sub-10% body fat</p>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest">This Week</p>
            <span className="text-xs text-neutral-500">{totalMins} min</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={trainingWeek} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f0f0f" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#333', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#333', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="mins" fill="#ffffff" radius={[2, 2, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-neutral-700 mt-2">Target: 7+ hours/week</p>
        </div>
      </div>

      {/* ── GOALS ROW ─────────────────────────────────── */}
      <div className="p-5">
        <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-5">Goal Progress</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Sub-60 Hyrox', from: '68:30', to: '59:59', pct: 42, link: '/training' },
            { label: 'Sub-10% Body Fat', from: '14.2%', to: '9.9%', pct: 28, link: '/body' },
            { label: '£10k/mo Online', from: '£1,450', to: '£10,000', pct: 15, link: '/finance' },
          ].map(g => (
            <Link key={g.label} href={g.link} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-300 font-medium">{g.label}</span>
                <span className="text-xs text-neutral-600 group-hover:text-white transition-colors flex items-center gap-1">
                  {g.pct}% <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="h-px bg-[#1a1a1a]">
                <div className="h-full bg-white transition-all duration-700" style={{ width: `${g.pct}%` }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-neutral-700">{g.from}</span>
                <span className="text-[10px] text-neutral-700">{g.to}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {showLog && <QuickLogModal type={logType} onClose={() => setShowLog(false)} />}
    </div>
  )
}
