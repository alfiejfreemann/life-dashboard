'use client'

import { useState } from 'react'
import { TrendingDown, Target, Plus, Camera, Ruler, Scale, ArrowDown, Info } from 'lucide-react'
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import QuickLogModal from '@/components/QuickLogModal'

const weightHistory = [
  { date: '1 Apr', weight: 82.4, bf: 16.2 },
  { date: '8 Apr', weight: 82.1, bf: 15.9 },
  { date: '15 Apr', weight: 81.6, bf: 15.4 },
  { date: '22 Apr', weight: 81.2, bf: 15.1 },
  { date: '29 Apr', weight: 80.8, bf: 14.8 },
  { date: '6 May', weight: 80.4, bf: 14.4 },
  { date: '8 May', weight: 80.2, bf: 14.2 },
]

const measurements = [
  { part: 'Waist', current: 80, start: 85, unit: 'cm', goal: 74 },
  { part: 'Chest', current: 104, start: 102, unit: 'cm', goal: 108 },
  { part: 'L. Arm', current: 37, start: 36, unit: 'cm', goal: 40 },
  { part: 'R. Arm', current: 37.5, start: 36.5, unit: 'cm', goal: 40 },
  { part: 'L. Quad', current: 58, start: 56, unit: 'cm', goal: 63 },
  { part: 'R. Quad', current: 58.5, start: 56.5, unit: 'cm', goal: 63 },
]

// Testosterone optimisation checklist
const TESTO_PROTOCOL = [
  { action: 'Morning sunlight (10-20 min)', category: 'Circadian', impact: 'high' },
  { action: 'Strength train 4x/week (compound lifts)', category: 'Training', impact: 'high' },
  { action: 'Sleep 8-9 hours — DEEP SLEEP = testosterone', category: 'Recovery', impact: 'high' },
  { action: 'Eat saturated fats (eggs, red meat, olive oil)', category: 'Nutrition', impact: 'high' },
  { action: 'Zinc + Magnesium supplement before bed', category: 'Supplements', impact: 'medium' },
  { action: 'Vitamin D3 (5000 IU daily)', category: 'Supplements', impact: 'medium' },
  { action: 'Cold exposure (ice bath / cold shower)', category: 'Recovery', impact: 'medium' },
  { action: 'Reduce alcohol to 0', category: 'Lifestyle', impact: 'high' },
  { action: 'Manage stress (cortisol kills testosterone)', category: 'Lifestyle', impact: 'high' },
  { action: 'Intermittent fasting (16:8) if cutting', category: 'Nutrition', impact: 'medium' },
  { action: 'Sprint intervals 1-2x/week', category: 'Training', impact: 'medium' },
  { action: 'Ashwagandha (600mg/day)', category: 'Supplements', impact: 'medium' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="font-semibold text-sm" style={{ color: p.color }}>
            {p.name}: {p.value}{p.name === 'bf' ? '%' : ' kg'}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function BodyPage() {
  const [showLog, setShowLog] = useState(false)
  const [checkedProtocol, setCheckedProtocol] = useState<Set<string>>(new Set())

  const currentWeight = 80.2
  const currentBF = 14.2
  const targetBF = 9.9
  const leanMassKg = currentWeight * (1 - currentBF / 100)
  const targetWeight = leanMassKg / (1 - targetBF / 100)
  const fatToLose = currentWeight - targetWeight

  const toggleProtocol = (action: string) => {
    setCheckedProtocol(prev => {
      const next = new Set(prev)
      next.has(action) ? next.delete(action) : next.add(action)
      return next
    })
  }

  return (
    <div className="animate-fade-in space-y-6 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <TrendingDown className="w-7 h-7 text-brand-green" />
            Body Composition
          </h1>
          <p className="text-gray-500 text-sm mt-1">Bigger + leaner + more testosterone — all at once</p>
        </div>
        <button onClick={() => setShowLog(true)} className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Log Today
        </button>
      </div>

      {/* Key body stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-white">{currentWeight} kg</p>
          <p className="text-xs text-gray-500 mt-1">Current Weight</p>
          <p className="text-xs text-brand-green mt-0.5 flex items-center justify-center gap-1">
            <ArrowDown className="w-3 h-3" />2.2kg lost
          </p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-orange">{currentBF}%</p>
          <p className="text-xs text-gray-500 mt-1">Body Fat %</p>
          <p className="text-xs text-gray-600 mt-0.5">Goal: sub 10%</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-cyan">{leanMassKg.toFixed(1)} kg</p>
          <p className="text-xs text-gray-500 mt-1">Lean Mass</p>
          <p className="text-xs text-gray-600 mt-0.5">Protect this at all costs</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-purple">{fatToLose.toFixed(1)} kg</p>
          <p className="text-xs text-gray-500 mt-1">Fat Left to Lose</p>
          <p className="text-xs text-gray-600 mt-0.5">Target: {targetWeight.toFixed(1)}kg @ 10%</p>
        </div>
      </div>

      {/* The Math Card */}
      <div className="card bg-gradient-to-r from-brand-cyan/5 to-brand-green/5 border-brand-cyan/15">
        <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-brand-cyan" />
          The Recomp Blueprint — Bigger AND Leaner
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-brand-cyan font-semibold mb-2">Daily Calorie Target</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>Maintenance: ~2,900 kcal</p>
              <p>Deficit for cutting: <span className="text-white">2,500 kcal</span></p>
              <p>Protein: <span className="text-white">200g minimum</span> (2.5g/kg)</p>
              <p>Rate of loss: <span className="text-brand-green">~0.5kg/week</span></p>
            </div>
          </div>
          <div>
            <p className="text-brand-green font-semibold mb-2">Timeline to Sub-10% BF</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>Fat to lose: <span className="text-white">{fatToLose.toFixed(1)}kg</span></p>
              <p>At 0.5kg/wk: <span className="text-white">~{Math.ceil(fatToLose / 0.5)} weeks</span></p>
              <p>Target date: <span className="text-brand-orange">Aug/Sep 2026</span></p>
              <p>Race day lean: <span className="text-brand-green">achievable</span></p>
            </div>
          </div>
          <div>
            <p className="text-brand-orange font-semibold mb-2">Muscle Growth Strategy</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>Progressive overload every session</p>
              <p>Prioritise <span className="text-white">compound lifts</span></p>
              <p>Legs 2x/week minimum</p>
              <p>Creatine 5g/day non-negotiable</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-cyan" />
            Weight Trend
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weightHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} domain={[78, 84]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={targetWeight} stroke="#00ff88" strokeDasharray="4 4" label={{ value: `${targetWeight.toFixed(1)}kg goal`, fill: '#00ff88', fontSize: 10 }} />
              <Area type="monotone" dataKey="weight" name="weight" stroke="#00f5ff" strokeWidth={2} fill="url(#wGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-orange" />
            Body Fat % Trend
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weightHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} domain={[9, 18]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={10} stroke="#ff6b35" strokeDasharray="4 4" label={{ value: '10% goal', fill: '#ff6b35', fontSize: 10 }} />
              <Line type="monotone" dataKey="bf" name="bf" stroke="#ff6b35" strokeWidth={2} dot={{ fill: '#ff6b35', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Measurements */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-brand-cyan" />
          Body Measurements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {measurements.map(m => {
            const isGrowing = m.part !== 'Waist'
            const progress = isGrowing
              ? ((m.current - m.start) / (m.goal - m.start)) * 100
              : ((m.start - m.current) / (m.start - m.goal)) * 100
            const pctClamped = Math.min(Math.max(progress, 0), 100)

            return (
              <div key={m.part} className="bg-dark-600/40 rounded-xl p-3 border border-dark-500">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-gray-400">{m.part}</span>
                  <span className="text-sm font-bold text-white">{m.current}{m.unit}</span>
                </div>
                <div className="h-1.5 rounded-full bg-dark-400 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isGrowing ? 'bg-brand-cyan' : 'bg-brand-green'}`}
                    style={{ width: `${pctClamped}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-600">Start: {m.start}{m.unit}</span>
                  <span className={`text-xs ${isGrowing ? 'text-brand-cyan' : 'text-brand-green'}`}>→ {m.goal}{m.unit}</span>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-600 mt-3">Measure weekly, same time, fasted. Waist down = fat loss. Arms/quads up = muscle gain.</p>
      </div>

      {/* Testosterone protocol */}
      <div className="card">
        <h2 className="font-semibold text-white mb-2 flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-orange" />
          Double Testosterone Protocol
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Natural testosterone can be doubled through lifestyle. Tick what you're doing consistently.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {TESTO_PROTOCOL.map(item => {
            const checked = checkedProtocol.has(item.action)
            return (
              <button
                key={item.action}
                onClick={() => toggleProtocol(item.action)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200
                  ${checked
                    ? 'bg-brand-orange/10 border-brand-orange/20'
                    : 'bg-dark-600/30 border-dark-500 hover:border-dark-400'
                  }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center
                  ${checked ? 'bg-brand-orange border-brand-orange' : 'border-dark-300'}`}>
                  {checked && <span className="text-black text-xs font-bold">✓</span>}
                </div>
                <div>
                  <p className={`text-xs font-medium ${checked ? 'text-brand-orange' : 'text-gray-300'}`}>
                    {item.action}
                  </p>
                  <div className="flex gap-1 mt-0.5">
                    <span className="text-xs text-gray-600">{item.category}</span>
                    {item.impact === 'high' && (
                      <span className="text-xs text-brand-orange font-semibold">· HIGH IMPACT</span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        <p className="text-xs text-gray-600 mt-3">
          You're doing {checkedProtocol.size}/{TESTO_PROTOCOL.length} consistently. At 10+, expect 40-80% testosterone increase over 3-6 months.
        </p>
      </div>

      {showLog && <QuickLogModal type="body" onClose={() => setShowLog(false)} />}
    </div>
  )
}
