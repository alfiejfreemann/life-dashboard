'use client'

import { useState } from 'react'
import {
  Zap, TrendingUp, DollarSign, Flame, CheckCircle2, Circle,
  Plus, ChevronRight, Timer, Dumbbell, Apple, Heart, Target,
  Trophy, AlertTriangle, ArrowUp, ArrowDown, BarChart3, Activity
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import QuickLogModal from '@/components/QuickLogModal'

// ── HYROX sub-60 station targets ───────────────────────────────────────────
const HYROX_STATIONS = [
  { station: 'Run 1km', target: '4:30', current: '5:10', pct: 73, color: '#00f5ff' },
  { station: 'SkiErg', target: '4:00', current: '4:45', pct: 69, color: '#00f5ff' },
  { station: 'Sled Push', target: '2:20', current: '3:00', pct: 65, color: '#00f5ff' },
  { station: 'Sled Pull', target: '2:20', current: '2:50', pct: 73, color: '#00f5ff' },
  { station: 'Burpee BJ', target: '4:10', current: '5:30', pct: 58, color: '#ff6b35' },
  { station: 'Row 1km', target: '3:50', current: '4:20', pct: 79, color: '#00f5ff' },
  { station: 'Farmers Carry', target: '2:30', current: '2:40', pct: 87, color: '#00ff88' },
  { station: 'Sandbag Lunges', target: '4:10', current: '5:00', pct: 62, color: '#ff6b35' },
  { station: 'Wall Balls', target: '5:10', current: '6:30', pct: 58, color: '#ff6b35' },
]

const DAILY_HABITS = [
  { id: 'training', label: 'Training session completed', category: 'fitness' },
  { id: 'protein', label: 'Hit protein target (200g+)', category: 'nutrition' },
  { id: 'sleep', label: '8h sleep', category: 'recovery' },
  { id: 'zone2', label: '30min Zone 2 cardio', category: 'fitness' },
  { id: 'hydration', label: '3L water', category: 'nutrition' },
  { id: 'sunlight', label: 'Morning sunlight (testosterone)', category: 'health' },
  { id: 'cold', label: 'Cold shower / ice bath', category: 'recovery' },
  { id: 'steps', label: '10,000 steps', category: 'fitness' },
]

// Sample weight trend data
const weightData = [
  { date: 'Apr 1', weight: 82.4 },
  { date: 'Apr 8', weight: 82.1 },
  { date: 'Apr 15', weight: 81.6 },
  { date: 'Apr 22', weight: 81.2 },
  { date: 'Apr 29', weight: 80.8 },
  { date: 'May 6', weight: 80.4 },
  { date: 'May 8', weight: 80.2 },
]

const trainingWeekData = [
  { day: 'Mon', mins: 65, type: 'Run' },
  { day: 'Tue', mins: 90, type: 'Strength' },
  { day: 'Wed', mins: 45, type: 'Zone 2' },
  { day: 'Thu', mins: 75, type: 'Hyrox Sim' },
  { day: 'Fri', mins: 60, type: 'Run' },
  { day: 'Sat', mins: 120, type: 'Long Run' },
  { day: 'Sun', mins: 0, type: 'Rest' },
]

const radarData = [
  { subject: 'Running', A: 62 },
  { subject: 'Strength', A: 74 },
  { subject: 'Endurance', A: 58 },
  { subject: 'Recovery', A: 70 },
  { subject: 'Nutrition', A: 65 },
  { subject: 'Sleep', A: 72 },
]

function getDaysToRace() {
  const raceDate = new Date('2026-07-19')
  const today = new Date()
  return Math.ceil((raceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function getWeeklyTrainingLoad() {
  return trainingWeekData.reduce((sum, d) => sum + d.mins, 0)
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-white font-semibold">{payload[0].value}{payload[0].unit || ''}</p>
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

  const toggleHabit = (id: string) => {
    setHabits(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const openLog = (type: 'workout' | 'body' | 'nutrition') => {
    setLogType(type)
    setShowQuickLog(true)
  }

  return (
    <div className="animate-fade-in space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <div>
          <p className="text-gray-500 text-sm">{today}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-0.5">
            {getGreeting()}, Alfie
          </h1>
          <p className="text-brand-cyan text-sm mt-1 font-medium">
            {daysToRace} days until Hyrox Sydney · You need to be ready.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openLog('workout')} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Log Workout
          </button>
          <button onClick={() => openLog('body')} className="btn-ghost flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Log Body
          </button>
        </div>
      </div>

      {/* Key stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Hyrox Countdown"
          value={`${Math.floor(daysToRace / 7)}w ${daysToRace % 7}d`}
          sub="19 July 2026"
          icon={<Timer className="w-5 h-5" />}
          color="cyan"
          status={daysToRace < 30 ? 'warning' : 'ok'}
        />
        <StatCard
          label="Body Weight"
          value="80.2 kg"
          sub="↓ 2.2kg from start"
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
          status="ok"
        />
        <StatCard
          label="Est. Body Fat"
          value="14.2%"
          sub="Goal: sub 10%"
          icon={<Target className="w-5 h-5" />}
          color="orange"
          status="warning"
        />
        <StatCard
          label="Online Income"
          value="£1,450"
          sub="Goal: £10,000/mo"
          icon={<DollarSign className="w-5 h-5" />}
          color="purple"
          status="warning"
        />
      </div>

      {/* Today's priorities + habits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's mission */}
        <div className="lg:col-span-2 card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-brand-orange" />
              Today's Mission
            </h2>
            <span className="badge bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
              {completedHabits}/{DAILY_HABITS.length} done
            </span>
          </div>

          {/* Priority actions */}
          <div className="space-y-2">
            <PriorityAction
              icon={<Zap className="w-4 h-4 text-brand-cyan" />}
              title="Hyrox Training Block"
              desc="Wall Balls + Sandbag Lunges → these are your weakest stations. 4 sets max effort."
              urgency="high"
            />
            <PriorityAction
              icon={<Apple className="w-4 h-4 text-brand-green" />}
              title="Hit 200g protein today"
              desc="You're in a body recomp phase. Protein is non-negotiable to preserve muscle while cutting."
              urgency="high"
            />
            <PriorityAction
              icon={<Heart className="w-4 h-4 text-brand-purple" />}
              title="Zone 2 run (30-45 min)"
              desc="Aerobic base is what separates sub-60 Hyrox finishers. Keep HR 130-145bpm."
              urgency="medium"
            />
            <PriorityAction
              icon={<Dumbbell className="w-4 h-4 text-brand-orange" />}
              title="Leg strength — squats + RDLs"
              desc="Leg power directly translates to sled push/pull speed. Progressive overload every session."
              urgency="medium"
            />
          </div>
        </div>

        {/* Habit tracker */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
              Daily Habits
            </h2>
            <span className="text-xs text-gray-500">{completedHabits}/{DAILY_HABITS.length}</span>
          </div>

          <div className="h-1.5 rounded-full bg-dark-400 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-green transition-all duration-500"
              style={{ width: `${(completedHabits / DAILY_HABITS.length) * 100}%` }}
            />
          </div>

          <div className="space-y-1.5">
            {DAILY_HABITS.map(habit => (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-200 text-sm
                  ${habits[habit.id]
                    ? 'bg-brand-green/10 border border-brand-green/20 text-brand-green'
                    : 'bg-dark-600/50 border border-dark-500 text-gray-400 hover:text-white hover:bg-dark-600'
                  }`}
              >
                {habits[habit.id]
                  ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  : <Circle className="w-4 h-4 flex-shrink-0" />
                }
                <span className="text-xs leading-tight">{habit.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weight trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Weight Trend</h2>
            <div className="flex items-center gap-1.5 text-brand-green text-sm font-medium">
              <ArrowDown className="w-4 h-4" />
              -2.2 kg
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weightData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="weight" stroke="#00f5ff" strokeWidth={2} fill="url(#weightGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 mt-2">Goal: 74kg @ sub-10% body fat</p>
        </div>

        {/* Weekly training volume */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">This Week's Training</h2>
            <span className="text-brand-cyan text-sm font-medium">{getWeeklyTrainingLoad()} min total</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={trainingWeekData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="mins" fill="#00f5ff" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 mt-2">Target: 7+ hours/week for sub-60</p>
        </div>
      </div>

      {/* Hyrox station breakdown */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-brand-cyan" />
              Hyrox Sub-60 Breakdown
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Your current vs target time per station</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Est. current finish</p>
            <p className="text-brand-orange font-bold text-lg">~68:30</p>
            <p className="text-xs text-gray-600">Target: 59:59</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {HYROX_STATIONS.map((s) => (
            <div key={s.station} className="bg-dark-600/40 rounded-xl p-3 border border-dark-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-300">{s.station}</span>
                <span className={`text-xs font-bold ${s.pct >= 80 ? 'text-brand-green' : s.pct >= 65 ? 'text-brand-cyan' : 'text-brand-orange'}`}>
                  {s.pct >= 80 ? '✓ On track' : s.pct >= 65 ? '~ Close' : '⚡ Needs work'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Current: <span className="text-white font-medium">{s.current}</span></span>
                <span>Target: <span className="text-brand-cyan font-medium">{s.target}</span></span>
              </div>
              <div className="h-1.5 rounded-full bg-dark-400 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${s.pct}%`,
                    background: s.pct >= 80 ? '#00ff88' : s.pct >= 65 ? '#00f5ff' : '#ff6b35'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-brand-orange/10 border border-brand-orange/20">
          <p className="text-brand-orange text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Priority focus: Wall Balls + Burpee Broad Jump + Sandbag Lunges
          </p>
          <p className="text-xs text-gray-400 mt-1">
            These 3 stations are costing you ~8 minutes. Nail them and you hit sub-60 with room to spare.
          </p>
        </div>
      </div>

      {/* Performance radar + goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar */}
        <div className="card">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-cyan" />
            Performance Profile
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <PolarGrid stroke="#1a1a1a" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 11 }} />
              <Radar name="You" dataKey="A" stroke="#00f5ff" fill="#00f5ff" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Goal progress */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-green" />
            Goal Progress
          </h2>
          <GoalProgress label="Sub-60 Hyrox Sydney" current={68.5} target={59.9} unit="min" pct={42} color="cyan" invert />
          <GoalProgress label="Body Fat Sub 10%" current={14.2} target={9.9} unit="%" pct={28} color="orange" invert />
          <GoalProgress label="£10k/mo Online Income" current={1450} target={10000} unit="£" pct={15} color="purple" />
          <GoalProgress label="Gym Job Sydney (June)" current={2} target={10} unit="apps" pct={20} color="green" />
          <GoalProgress label="Double Testosterone" current={1} target={2} unit="× baseline" pct={35} color="orange" />
        </div>
      </div>

      {/* Quick log modal */}
      {showQuickLog && (
        <QuickLogModal type={logType} onClose={() => setShowQuickLog(false)} />
      )}
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon, color, status,
}: {
  label: string; value: string; sub: string; icon: React.ReactNode
  color: 'cyan' | 'green' | 'orange' | 'purple'; status: 'ok' | 'warning' | 'danger'
}) {
  const colorMap = {
    cyan: 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20',
    green: 'text-brand-green bg-brand-green/10 border-brand-green/20',
    orange: 'text-brand-orange bg-brand-orange/10 border-brand-orange/20',
    purple: 'text-brand-purple bg-brand-purple/10 border-brand-purple/20',
  }
  const dotMap = { ok: 'bg-brand-green', warning: 'bg-brand-orange', danger: 'bg-brand-red' }

  return (
    <div className="card hover:border-dark-400 transition-all duration-200 cursor-default">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
          {icon}
        </div>
        <span className={`w-2 h-2 rounded-full mt-1 ${dotMap[status]}`} />
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      <p className="text-xs text-gray-600 mt-1">{sub}</p>
    </div>
  )
}

function PriorityAction({
  icon, title, desc, urgency,
}: {
  icon: React.ReactNode; title: string; desc: string; urgency: 'high' | 'medium' | 'low'
}) {
  const urgencyStyle = {
    high: 'border-brand-orange/30 bg-brand-orange/5',
    medium: 'border-dark-400 bg-dark-600/30',
    low: 'border-dark-400 bg-dark-600/20',
  }

  return (
    <div className={`flex gap-3 p-3 rounded-xl border ${urgencyStyle[urgency]}`}>
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function GoalProgress({
  label, current, target, unit, pct, color, invert,
}: {
  label: string; current: number; target: number; unit: string
  pct: number; color: 'cyan' | 'green' | 'orange' | 'purple'; invert?: boolean
}) {
  const colorMap = {
    cyan: 'bg-brand-cyan', green: 'bg-brand-green',
    orange: 'bg-brand-orange', purple: 'bg-brand-purple',
  }
  const textMap = {
    cyan: 'text-brand-cyan', green: 'text-brand-green',
    orange: 'text-brand-orange', purple: 'text-brand-purple',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-gray-300 font-medium">{label}</span>
        <span className={`text-xs font-bold ${textMap[color]}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-dark-400 overflow-hidden">
        <div className={`h-full rounded-full ${colorMap[color]} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-600">
          Now: {unit === '£' ? `${unit}${current.toLocaleString()}` : `${current} ${unit}`}
        </span>
        <span className="text-xs text-gray-600">
          Target: {unit === '£' ? `${unit}${target.toLocaleString()}` : `${target} ${unit}`}
        </span>
      </div>
    </div>
  )
}
