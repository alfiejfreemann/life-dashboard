'use client'

import { useState } from 'react'
import { Heart, Moon, Zap, TrendingUp, Plus, Info, Activity } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'
import QuickLogModal from '@/components/QuickLogModal'

const recoveryHistory = [
  { date: '1 May', hrv: 58, sleep: 7.2, energy: 6 },
  { date: '2 May', hrv: 62, sleep: 7.8, energy: 7 },
  { date: '3 May', hrv: 55, sleep: 6.5, energy: 5 },
  { date: '4 May', hrv: 67, sleep: 8.2, energy: 8 },
  { date: '5 May', hrv: 70, sleep: 8.5, energy: 9 },
  { date: '6 May', hrv: 64, sleep: 7.9, energy: 7 },
  { date: '7 May', hrv: 72, sleep: 8.1, energy: 8 },
  { date: '8 May', hrv: 68, sleep: 7.5, energy: 7 },
]

const RECOVERY_TIPS = [
  {
    title: 'HRV below 50 = back off',
    detail: 'If your morning HRV from the Garmin HRM Pro is below 50, drop intensity. Do Zone 2 only. Racing a low HRV day destroys recovery.',
    icon: '📉',
  },
  {
    title: 'Sleep is your #1 performance drug',
    detail: '8-9 hours in a dark, cold room (18-19°C). Deep sleep = testosterone + GH release. This is when you actually get bigger and stronger.',
    icon: '😴',
  },
  {
    title: 'Post-workout window: 30-60 minutes',
    detail: '40g fast protein + simple carbs immediately post-session. This stops cortisol spiking and kickstarts recovery.',
    icon: '🥤',
  },
  {
    title: 'Deload every 4th week',
    detail: 'Drop volume to 60% for one full week. Supercompensation happens during deload — you come back STRONGER.',
    icon: '📅',
  },
  {
    title: 'Cold exposure timing matters',
    detail: 'Cold immediately post strength = blunts hypertrophy. Use cold 6+ hours after lifting, or only after cardio/Hyrox sessions.',
    icon: '🧊',
  },
]

const sleepPhases = [
  { hour: '22:00', deep: 0, rem: 0, light: 0 },
  { hour: '23:00', deep: 20, rem: 5, light: 35 },
  { hour: '00:00', deep: 45, rem: 10, light: 5 },
  { hour: '01:00', deep: 50, rem: 15, light: 5 },
  { hour: '02:00', deep: 30, rem: 35, light: 5 },
  { hour: '03:00', deep: 15, rem: 55, light: 10 },
  { hour: '04:00', deep: 5, rem: 60, light: 15 },
  { hour: '05:00', deep: 5, rem: 45, light: 20 },
  { hour: '06:00', deep: 0, rem: 20, light: 60 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="font-semibold text-xs" style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function RecoveryPage() {
  const [showLog, setShowLog] = useState(false)
  const [todayMetrics, setTodayMetrics] = useState({
    hrv: '',
    sleep_hrs: '',
    energy: 7,
    mood: 7,
  })

  const today = recoveryHistory[recoveryHistory.length - 1]
  const avgHRV = Math.round(recoveryHistory.reduce((s, d) => s + d.hrv, 0) / recoveryHistory.length)
  const avgSleep = (recoveryHistory.reduce((s, d) => s + d.sleep, 0) / recoveryHistory.length).toFixed(1)

  const getHRVStatus = (hrv: number) => {
    if (hrv >= 70) return { label: 'Excellent — push hard', color: 'text-brand-green', bg: 'bg-brand-green/10 border-brand-green/20' }
    if (hrv >= 55) return { label: 'Good — normal training', color: 'text-brand-cyan', bg: 'bg-brand-cyan/10 border-brand-cyan/20' }
    if (hrv >= 40) return { label: 'Moderate — reduce volume', color: 'text-brand-orange', bg: 'bg-brand-orange/10 border-brand-orange/20' }
    return { label: 'Low — Zone 2 only', color: 'text-brand-red', bg: 'bg-brand-red/10 border-brand-red/20' }
  }

  const hrvStatus = getHRVStatus(today.hrv)

  return (
    <div className="animate-fade-in space-y-6 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Heart className="w-7 h-7 text-brand-red" />
            Recovery & Readiness
          </h1>
          <p className="text-gray-500 text-sm mt-1">You don't grow in the gym. You grow in recovery.</p>
        </div>
        <button onClick={() => setShowLog(true)} className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Log Recovery
        </button>
      </div>

      {/* Today's readiness */}
      <div className={`card border ${hrvStatus.bg}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="label-muted mb-1">Today's Readiness</p>
            <div className="flex items-center gap-3">
              <p className="text-4xl font-bold text-white">{today.hrv}</p>
              <div>
                <p className="text-sm font-semibold text-white">HRV</p>
                <p className={`text-xs font-semibold ${hrvStatus.color}`}>{hrvStatus.label}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Last night</p>
            <p className="text-2xl font-bold text-white">{today.sleep}h</p>
            <p className="text-xs text-gray-500">sleep</p>
          </div>
        </div>
        <div className="mt-3 flex gap-4">
          <div>
            <p className="text-xs text-gray-500">7-day avg HRV</p>
            <p className="text-white font-semibold">{avgHRV}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">7-day avg sleep</p>
            <p className="text-white font-semibold">{avgSleep}h</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Energy today</p>
            <p className="text-white font-semibold">{today.energy}/10</p>
          </div>
        </div>
      </div>

      {/* Garmin HRV tip */}
      <div className="card bg-brand-cyan/5 border-brand-cyan/15">
        <div className="flex gap-3 items-start">
          <Activity className="w-5 h-5 text-brand-cyan mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm">Garmin HRM Pro Plus Setup</p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Wear your HRM Pro Plus to bed. Garmin's Body Battery and HRV Status measures overnight.
              Check Garmin Connect → Body Battery when you wake up. If it's below 40, reduce today's training intensity.
              Once your Epix Pro Gen 2 arrives, it'll track this automatically on your wrist.
            </p>
          </div>
        </div>
      </div>

      {/* HRV trend */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-red" />
          HRV Trend (7 days)
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={recoveryHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4757" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ff4757" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} domain={[40, 90]} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="hrv" name="HRV" stroke="#ff4757" strokeWidth={2} fill="url(#hrvGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sleep chart */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5 text-brand-purple" />
          Sleep Duration (hours)
        </h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={recoveryHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} domain={[5, 10]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="sleep" name="Sleep (hrs)" fill="#a855f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-600 mt-2">Target: 8-9 hours. Below 7 hours = suppressed testosterone + poor recovery.</p>
      </div>

      {/* Today log form */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-cyan" />
          Log Today's Recovery
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-muted mb-1.5 block">Morning HRV</label>
            <input type="number" placeholder="65" value={todayMetrics.hrv}
              onChange={e => setTodayMetrics(p => ({ ...p, hrv: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label-muted mb-1.5 block">Sleep Hours</label>
            <input type="number" step="0.5" placeholder="8.0" value={todayMetrics.sleep_hrs}
              onChange={e => setTodayMetrics(p => ({ ...p, sleep_hrs: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label-muted mb-1.5 block">Energy Level (1-10)</label>
            <input type="range" min="1" max="10" value={todayMetrics.energy}
              onChange={e => setTodayMetrics(p => ({ ...p, energy: Number(e.target.value) }))}
              className="w-full accent-brand-cyan" />
            <p className="text-center text-brand-cyan font-bold mt-1">{todayMetrics.energy}/10</p>
          </div>
          <div>
            <label className="label-muted mb-1.5 block">Mood (1-10)</label>
            <input type="range" min="1" max="10" value={todayMetrics.mood}
              onChange={e => setTodayMetrics(p => ({ ...p, mood: Number(e.target.value) }))}
              className="w-full accent-brand-purple" />
            <p className="text-center text-brand-purple font-bold mt-1">{todayMetrics.mood}/10</p>
          </div>
        </div>
        <button className="btn-primary mt-4">Save Recovery Log</button>
      </div>

      {/* Recovery tips */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-brand-cyan" />
          Recovery Mastery
        </h2>
        <div className="space-y-3">
          {RECOVERY_TIPS.map(tip => (
            <div key={tip.title} className="flex gap-3 p-3 rounded-xl bg-dark-600/30 border border-dark-500">
              <span className="text-xl flex-shrink-0">{tip.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{tip.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{tip.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showLog && <QuickLogModal type="workout" onClose={() => setShowLog(false)} />}
    </div>
  )
}
