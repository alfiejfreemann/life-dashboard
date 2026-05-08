'use client'

import { useState } from 'react'
import {
  Zap, Timer, TrendingUp, Target, Plus, AlertTriangle,
  CheckCircle2, Activity, BarChart3, Clock, Flame
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts'
import QuickLogModal from '@/components/QuickLogModal'

const HYROX_PLAN = [
  {
    week: 'This Week',
    focus: 'Station Weakness Work',
    sessions: [
      { day: 'Mon', type: 'Run', detail: '8km easy — Zone 2 (HR 130-145)', done: true },
      { day: 'Tue', type: 'Strength', detail: 'Squat 4×6, RDL 4×8, Leg Press 3×12 — leg power', done: true },
      { day: 'Wed', type: 'Hyrox Station', detail: 'Wall Balls 6×25 + Burpee BJ 5×20m — weakest stations', done: false },
      { day: 'Thu', type: 'Run', detail: '5km tempo at target race pace (4:30/km)', done: false },
      { day: 'Fri', type: 'Full Hyrox Sim', detail: 'All 8 stations + 8×1km runs. Time every station.', done: false },
      { day: 'Sat', type: 'Long Run', detail: '12-14km — build aerobic base', done: false },
      { day: 'Sun', type: 'Rest / Walk', detail: '10k steps, mobility, sleep 9h', done: false },
    ],
  },
]

const STATION_GUIDE = [
  { name: 'SkiErg 1000m', target: '4:00', tip: 'Arms straight, hinge from hips. Don\'t death-grip. Keep pace 1:55-2:00/500m', weakArea: false },
  { name: 'Sled Push 50m', target: '2:20', tip: 'Short fast steps. Stay low. Drive through the floor. Sprint mentality.', weakArea: false },
  { name: 'Sled Pull 50m', target: '2:20', tip: 'Explosive arm pulls. Don\'t let the rope go slack. Keep rhythm.', weakArea: false },
  { name: 'Burpee Broad Jump 80m', target: '4:10', tip: 'Consistent rhythm > explosive bursts. Land softly, go again. This is your #1 weakness.', weakArea: true },
  { name: 'Row 1000m', target: '3:50', tip: 'Drive with legs first, lean back, pull to lower sternum. 1:52-1:55/500m pace.', weakArea: false },
  { name: 'Farmers Carry 200m', target: '2:30', tip: 'Don\'t stop. Grip endurance — train this. Walk fast, core tight.', weakArea: false },
  { name: 'Sandbag Lunges 100m', target: '4:10', tip: 'Full hip extension each rep. Don\'t rush — form matters. Hip flexor strength = key.', weakArea: true },
  { name: 'Wall Balls 100 reps', target: '5:10', tip: 'Unbroken sets of 25. Rest at top not bottom. Squat depth = throw height. This kills people.', weakArea: true },
]

const runPaceData = [
  { week: 'W1', pace: 5.4 },
  { week: 'W2', pace: 5.2 },
  { week: 'W3', pace: 5.1 },
  { week: 'W4', pace: 4.95 },
  { week: 'W5', pace: 4.85 },
  { week: 'W6', pace: 4.7 },
]

const weeklyVolumeData = [
  { week: 'Apr W1', run: 28, strength: 90, hyrox: 60 },
  { week: 'Apr W2', run: 32, strength: 85, hyrox: 75 },
  { week: 'Apr W3', run: 35, strength: 95, hyrox: 80 },
  { week: 'Apr W4', run: 38, strength: 90, hyrox: 90 },
  { week: 'May W1', run: 42, strength: 100, hyrox: 95 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="font-semibold" style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function TrainingPage() {
  const [showLog, setShowLog] = useState(false)
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set(['Mon', 'Tue']))

  const toggleSession = (day: string) => {
    setCompletedSessions(prev => {
      const next = new Set(prev)
      next.has(day) ? next.delete(day) : next.add(day)
      return next
    })
  }

  return (
    <div className="animate-fade-in space-y-6 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Zap className="w-7 h-7 text-brand-cyan" />
            Hyrox Training Hub
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your path to sub-60 in Sydney · Every session matters</p>
        </div>
        <button onClick={() => setShowLog(true)} className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Log Session
        </button>
      </div>

      {/* Key training metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-cyan">68:30</p>
          <p className="text-xs text-gray-500 mt-1">Est. Current Finish</p>
          <p className="text-xs text-gray-600 mt-0.5">Target: 59:59</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-white">4:48</p>
          <p className="text-xs text-gray-500 mt-1">Current Run Pace</p>
          <p className="text-xs text-gray-600 mt-0.5">Target: 4:10/km</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-green">455</p>
          <p className="text-xs text-gray-500 mt-1">Weekly Volume (min)</p>
          <p className="text-xs text-gray-600 mt-0.5">Target: 480+</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-orange">6</p>
          <p className="text-xs text-gray-500 mt-1">Sessions This Week</p>
          <p className="text-xs text-gray-600 mt-0.5">Target: 6</p>
        </div>
      </div>

      {/* Weekly plan */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-cyan" />
            This Week's Training Plan
          </h2>
          <span className="text-xs text-gray-500">{completedSessions.size}/7 sessions</span>
        </div>

        <div className="space-y-2">
          {HYROX_PLAN[0].sessions.map(session => {
            const done = completedSessions.has(session.day)
            return (
              <button
                key={session.day}
                onClick={() => toggleSession(session.day)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200
                  ${done
                    ? 'bg-brand-green/10 border-brand-green/20'
                    : 'bg-dark-600/40 border-dark-500 hover:border-dark-400'
                  }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {done
                    ? <CheckCircle2 className="w-5 h-5 text-brand-green" />
                    : <div className="w-5 h-5 rounded-full border-2 border-dark-400" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-8">{session.day}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                      ${session.type === 'Full Hyrox Sim' ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20'
                        : session.type === 'Strength' ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20'
                        : session.type === 'Rest / Walk' ? 'bg-dark-400 text-gray-500'
                        : 'bg-brand-green/10 text-brand-green border border-brand-green/20'
                      }`}
                    >
                      {session.type}
                    </span>
                  </div>
                  <p className={`text-sm mt-0.5 ${done ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                    {session.detail}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-cyan" />
            Running Pace Trend (min/km)
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={runPaceData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="week" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} domain={[4, 5.8]} reversed />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="pace" stroke="#00f5ff" strokeWidth={2} dot={{ fill: '#00f5ff', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 mt-2">↑ Faster is lower on this chart. Target: 4:10/km race pace.</p>
        </div>

        <div className="card">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-cyan" />
            Weekly Training Volume (km run)
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyVolumeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="run" name="Run (km)" fill="#00f5ff" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Station guide */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-cyan" />
            Station Mastery Guide
          </h2>
          <span className="text-xs text-brand-orange font-semibold">3 weak stations identified</span>
        </div>

        <div className="space-y-3">
          {STATION_GUIDE.map(station => (
            <div
              key={station.name}
              className={`p-4 rounded-xl border ${station.weakArea
                ? 'border-brand-orange/30 bg-brand-orange/5'
                : 'border-dark-500 bg-dark-600/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {station.weakArea && <AlertTriangle className="w-4 h-4 text-brand-orange flex-shrink-0" />}
                    <span className="font-semibold text-sm text-white">{station.name}</span>
                    <span className="text-xs text-brand-cyan font-mono">Target: {station.target}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{station.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/15">
          <p className="text-brand-cyan text-sm font-semibold mb-2 flex items-center gap-2">
            <Flame className="w-4 h-4" />
            The Math to Sub-60
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-400">
            <div>8 × 1km runs = <span className="text-white">~35:30</span></div>
            <div>8 stations = <span className="text-white">~22:00</span></div>
            <div>Transitions = <span className="text-white">~2:30</span></div>
            <div className="col-span-2 md:col-span-3 mt-1 text-brand-green font-semibold">
              Total target: 59:59 ✓ — it's achievable. You need 9 more mins off your current time.
            </div>
          </div>
        </div>
      </div>

      {showLog && <QuickLogModal type="workout" onClose={() => setShowLog(false)} />}
    </div>
  )
}
