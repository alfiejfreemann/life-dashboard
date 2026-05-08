'use client'

import { useState } from 'react'
import {
  Zap, TrendingUp, DollarSign, Flame, CheckCircle2, Circle,
  Plus, Timer, Dumbbell, Apple, Heart, Target,
  Trophy, AlertTriangle, ArrowDown, BarChart3, Activity
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import QuickLogModal from '@/components/QuickLogModal'

const HYROX_STATIONS = [
  { station: 'Run 1km ×8', target: '4:30', current: '5:10', pct: 73 },
  { station: 'SkiErg', target: '4:00', current: '4:45', pct: 69 },
  { station: 'Sled Push', target: '2:20', current: '3:00', pct: 65 },
  { station: 'Sled Pull', target: '2:20', current: '2:50', pct: 73 },
  { station: 'Burpee BJ', target: '4:10', current: '5:30', pct: 58 },
  { station: 'Row 1km', target: '3:50', current: '4:20', pct: 79 },
  { station: 'Farmers Carry', target: '2:30', current: '2:40', pct: 87 },
  { station: 'Sandbag Lunges', target: '4:10', current: '5:00', pct: 62 },
  { station: 'Wall Balls', target: '5:10', current: '6:30', pct: 58 },
]

const DAILY_HABITS = [
  { id: 'training', label: 'Training session completed' },
  { id: 'protein', label: 'Hit 200g protein' },
  { id: 'sleep', label: '8h+ sleep last night' },
  { id: 'zone2', label: '30min Zone 2 cardio' },
  { id: 'hydration', label: '3L water' },
  { id: 'sunlight', label: 'Morning sunlight (10 min)' },
  { id: 'cold', label: 'Cold shower' },
  { id: 'steps', label: '10,000 steps' },
]

const weightData = [
  { date: 'Apr 1', weight: 82.4 }, { date: 'Apr 8', weight: 82.1 },
  { date: 'Apr 15', weight: 81.6 }, { date: 'Apr 22', weight: 81.2 },
  { date: 'Apr 29', weight: 80.8 }, { date: 'May 6', weight: 80.4 },
  { date: 'May 8', weight: 80.2 },
]

const trainingWeekData = [
  { day: 'Mon', mins: 65 }, { day: 'Tue', mins: 90 }, { day: 'Wed', mins: 45 },
  { day: 'Thu', mins: 75 }, { day: 'Fri', mins: 60 }, { day: 'Sat', mins: 120 }, { day: 'Sun', mins: 0 },
]

const radarData = [
  { subject: 'Running', A: 62 }, { subject: 'Strength', A: 74 },
  { subject: 'Endurance', A: 58 }, { subject: 'Recovery', A: 70 },
  { subject: 'Nutrition', A: 65 }, { subject: 'Sleep', A: 72 },
]

function getDaysToRace() {
  return Math.ceil((new Date('2026-07-19').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-neutral-500 text-xs mb-1">{label}</p>
        <p className="text-white font-semibold">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const [habits, setHabits] = useState<Record<string, boolean>>({})
  const [showQuickLog, setShowQuickLog] = useState(false)
  const [logType, setLogType] = useState<'workout' | 'body' | 'nutrition'>('workout')

  const daysToRace = getDaysToRace()
  const completedHabits = Object.values(habits).filter(Boolean).length
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const totalMins = trainingWeekData.reduce((s, d) => s + d.mins, 0)

  const openLog = (type: 'workout' | 'body' | 'nutrition') => {
    setLogType(type); setShowQuickLog(true)
  }

  return (
    <div className="animate-fade-in space-y-5 pb-24 md:pb-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pt-2">
        <div>
          <p className="text-neutral-600 text-xs uppercase tracking-widest">{today}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">{getGreeting()}, Alfie</h1>
          <p className="text-blue-500 text-sm mt-1 font-medium">
            {daysToRace} days to Hyrox Sydney — stay locked in.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openLog('workout')} className="btn-blue flex items-center gap-2">
            <Plus className="w-4 h-4" /> Log Workout
          </button>
          <button onClick={() => openLog('body')} className="btn-ghost flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Log Body
          </button>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Hyrox Countdown" value={`${Math.floor(daysToRace / 7)}w ${daysToRace % 7}d`} sub="19 July 2026" icon={<Timer className="w-4 h-4" />} accent />
        <StatCard label="Body Weight" value="80.2 kg" sub="↓ 2.2kg from start" icon={<TrendingUp className="w-4 h-4" />} />
        <StatCard label="Body Fat %" value="14.2%" sub="Goal: sub 10%" icon={<Target className="w-4 h-4" />} />
        <StatCard label="Online Income" value="£1,450" sub="Goal: £10,000/mo" icon={<DollarSign className="w-4 h-4" />} />
      </div>

      {/* Mission + habits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-neutral-400" /> Today's Mission
            </h2>
            <span className="text-xs text-neutral-600">{completedHabits}/{DAILY_HABITS.length} habits done</span>
          </div>
          <PriorityAction icon={<Zap className="w-4 h-4 text-blue-500" />} title="Hyrox Station Work" desc="Wall Balls + Sandbag Lunges are your weakest stations. 4 sets max effort today." urgency="high" />
          <PriorityAction icon={<Apple className="w-4 h-4 text-white" />} title="Hit 200g protein" desc="You're in recomp. Protein protects muscle while you cut. Non-negotiable." urgency="high" />
          <PriorityAction icon={<Heart className="w-4 h-4 text-neutral-400" />} title="Zone 2 run — 30-45 min" desc="HR 130-145bpm. Aerobic base is what separates sub-60 finishers." urgency="medium" />
          <PriorityAction icon={<Dumbbell className="w-4 h-4 text-neutral-400" />} title="Leg strength" desc="Squats + RDLs. Leg power directly translates to sled speed. Add weight." urgency="medium" />
        </div>

        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-neutral-400" /> Daily Habits
            </h2>
            <span className="text-xs text-neutral-600">{completedHabits}/{DAILY_HABITS.length}</span>
          </div>
          <div className="h-1 rounded-full bg-[#1a1a1a] overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${(completedHabits / DAILY_HABITS.length) * 100}%` }}
            />
          </div>
          <div className="space-y-1.5">
            {DAILY_HABITS.map(habit => (
              <button
                key={habit.id}
                onClick={() => setHabits(p => ({ ...p, [habit.id]: !p[habit.id] }))}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-150 text-xs
                  ${habits[habit.id]
                    ? 'bg-white/5 border border-white/10 text-white'
                    : 'bg-[#0f0f0f] border border-[#1a1a1a] text-neutral-500 hover:text-neutral-300'
                  }`}
              >
                {habits[habit.id]
                  ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-white" />
                  : <Circle className="w-3.5 h-3.5 flex-shrink-0" />
                }
                {habit.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Weight Trend</h2>
            <span className="text-xs text-neutral-500 flex items-center gap-1">
              <ArrowDown className="w-3 h-3" /> −2.2 kg
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weightData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#111" />
              <XAxis dataKey="date" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={1.5} fill="url(#wg)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-neutral-700 mt-2">Goal: 74 kg @ sub-10% body fat</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">This Week's Training</h2>
            <span className="text-xs text-neutral-500">{totalMins} min</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={trainingWeekData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="mins" fill="#3b82f6" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-neutral-700 mt-2">Target: 7+ hours/week for sub-60</p>
        </div>
      </div>

      {/* Hyrox breakdown */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-neutral-400" /> Hyrox Sub-60 Breakdown
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">Current vs target time per station</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-600">Est. current finish</p>
            <p className="text-white font-bold text-xl">~68:30</p>
            <p className="text-xs text-neutral-700">Need to lose 8:31</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {HYROX_STATIONS.map(s => (
            <div key={s.station} className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-300">{s.station}</span>
                <span className={`text-xs font-semibold ${s.pct >= 80 ? 'text-white' : s.pct >= 65 ? 'text-blue-400' : 'text-neutral-500'}`}>
                  {s.pct >= 80 ? '✓ Good' : s.pct >= 65 ? '~ Close' : '↑ Fix this'}
                </span>
              </div>
              <div className="flex justify-between text-xs text-neutral-600 mb-1.5">
                <span>Now: <span className="text-neutral-300">{s.current}</span></span>
                <span>Target: <span className="text-blue-400">{s.target}</span></span>
              </div>
              <div className="h-1 rounded-full bg-[#1a1a1a]">
                <div className="h-full rounded-full transition-all duration-700" style={{
                  width: `${s.pct}%`,
                  background: s.pct >= 80 ? '#ffffff' : s.pct >= 65 ? '#3b82f6' : '#374151'
                }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
          <p className="text-white text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-neutral-500" />
            Priority: Wall Balls · Burpee Broad Jump · Sandbag Lunges
          </p>
          <p className="text-xs text-neutral-600 mt-1">
            These 3 stations are costing you ~8 minutes. Fix them and you hit sub-60 comfortably.
          </p>
        </div>
      </div>

      {/* Radar + goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-neutral-400" /> Performance Profile
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <PolarGrid stroke="#1a1a1a" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#555', fontSize: 11 }} />
              <Radar name="You" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-neutral-400" /> Goal Progress
          </h2>
          <GoalProgress label="Sub-60 Hyrox" current="68:30" target="59:59" pct={42} />
          <GoalProgress label="Body Fat Sub-10%" current="14.2%" target="9.9%" pct={28} />
          <GoalProgress label="£10k/mo Online" current="£1,450" target="£10,000" pct={15} />
          <GoalProgress label="Gym Job Sydney" current="2 apps" target="10 apps" pct={20} />
          <GoalProgress label="Double Testosterone" current="1×" target="2×" pct={35} />
        </div>
      </div>

      {showQuickLog && <QuickLogModal type={logType} onClose={() => setShowQuickLog(false)} />}
    </div>
  )
}

function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string; sub: string; icon: React.ReactNode; accent?: boolean
}) {
  return (
    <div className={`card hover:border-[#2a2a2a] transition-all duration-200 ${accent ? 'border-blue-900/40' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? 'bg-blue-950 text-blue-400' : 'bg-[#141414] text-neutral-500'}`}>
          {icon}
        </div>
        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${accent ? 'bg-blue-500' : 'bg-[#2a2a2a]'}`} />
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-xs text-neutral-600 mt-0.5">{label}</p>
      <p className="text-xs text-neutral-700 mt-0.5">{sub}</p>
    </div>
  )
}

function PriorityAction({ icon, title, desc, urgency }: {
  icon: React.ReactNode; title: string; desc: string; urgency: 'high' | 'medium'
}) {
  return (
    <div className={`flex gap-3 p-3 rounded-xl border ${urgency === 'high' ? 'border-[#1f2937] bg-[#0a0f18]' : 'border-[#1a1a1a] bg-[#0a0a0a]'}`}>
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function GoalProgress({ label, current, target, pct }: {
  label: string; current: string; target: string; pct: number
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-neutral-300">{label}</span>
        <span className="text-xs font-bold text-blue-500">{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-[#1a1a1a]">
        <div className="h-full rounded-full bg-blue-600 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-neutral-700">Now: {current}</span>
        <span className="text-xs text-neutral-700">Target: {target}</span>
      </div>
    </div>
  )
}
