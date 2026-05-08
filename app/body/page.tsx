'use client'

import { useState } from 'react'
import { TrendingDown, Target, Plus, Ruler, Scale, ArrowDown, Info, Zap } from 'lucide-react'
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

// Testosterone protocol with impact multipliers
const TESTO_PROTOCOL = [
  { action: 'Morning sunlight — 10-20 min outside', category: 'Circadian', impact: 'high', boost: 15, mechanism: 'Resets cortisol rhythm, boosts LH signalling' },
  { action: 'Strength train 4×/week — compound lifts', category: 'Training', impact: 'high', boost: 25, mechanism: 'Acute T spike post-lift, long-term receptor upregulation' },
  { action: '8-9 hours sleep — dark, cold room (18°C)', category: 'Recovery', impact: 'high', boost: 30, mechanism: '70% of daily T is produced during deep sleep (stages 3-4)' },
  { action: 'Eat saturated fat daily — eggs, red meat, olive oil', category: 'Nutrition', impact: 'high', boost: 20, mechanism: 'Cholesterol = testosterone precursor. Low fat = low T.' },
  { action: 'Zero alcohol', category: 'Lifestyle', impact: 'high', boost: 15, mechanism: 'Alcohol directly suppresses Leydig cells — the T factories' },
  { action: 'Manage stress — cortisol and T are inversely linked', category: 'Lifestyle', impact: 'high', boost: 12, mechanism: 'Cortisol competes with T. Chronic stress = chronically low T.' },
  { action: 'Sprint intervals 1-2×/week', category: 'Training', impact: 'medium', boost: 8, mechanism: 'High intensity = highest acute T spike of any exercise type' },
  { action: 'Zinc 25-30mg before bed', category: 'Supplements', impact: 'medium', boost: 10, mechanism: 'Essential cofactor for testosterone synthesis — most men are deficient' },
  { action: 'Vitamin D3 5000IU + K2 daily', category: 'Supplements', impact: 'medium', boost: 12, mechanism: 'D3 acts like a hormone — D-deficient men have 65% lower T' },
  { action: 'Magnesium Glycinate 400mg before bed', category: 'Supplements', impact: 'medium', boost: 8, mechanism: 'Increases free T by reducing SHBG binding' },
  { action: 'Cold exposure — ice bath or cold shower', category: 'Recovery', impact: 'medium', boost: 6, mechanism: 'Stimulates gonadotropin release + reduces testicular temp' },
  { action: 'Ashwagandha KSM-66 600mg/day', category: 'Supplements', impact: 'medium', boost: 10, mechanism: 'Reduces cortisol ~27%, studies show 15-40% T increase' },
]

const T_KILLERS = [
  { thing: 'Alcohol', effect: '−25% T after heavy night', severity: 'high' },
  { thing: 'Sleep deprivation (<6h)', effect: '−15% per night', severity: 'high' },
  { thing: 'Chronic cardio (no strength training)', effect: '−10-20%', severity: 'high' },
  { thing: 'Seed oils / ultra-processed food', effect: '−10-15%', severity: 'medium' },
  { thing: 'Chronic stress', effect: 'Cortisol blocks T production', severity: 'high' },
  { thing: 'Plastic bottles / BPA', effect: 'Xenoestrogens disrupt T', severity: 'medium' },
  { thing: 'Being overweight (high body fat)', effect: 'Aromatase converts T → oestrogen', severity: 'high' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-neutral-500 text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="font-semibold text-sm text-white">{p.name}: {p.value}{p.name === 'bf' ? '%' : ' kg'}</p>
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

  const totalBoost = TESTO_PROTOCOL
    .filter(p => checkedProtocol.has(p.action))
    .reduce((sum, p) => sum + p.boost, 0)
  const estimatedTMultiplier = (1 + Math.min(totalBoost, 120) / 100).toFixed(2)
  const checkedCount = checkedProtocol.size
  const highImpactDone = TESTO_PROTOCOL.filter(p => p.impact === 'high' && checkedProtocol.has(p.action)).length
  const highImpactTotal = TESTO_PROTOCOL.filter(p => p.impact === 'high').length

  const toggleProtocol = (action: string) => {
    setCheckedProtocol(prev => {
      const next = new Set(prev); next.has(action) ? next.delete(action) : next.add(action); return next
    })
  }

  return (
    <div className="animate-fade-in space-y-5 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <TrendingDown className="w-6 h-6 text-neutral-400" />
            Body Composition
          </h1>
          <p className="text-neutral-600 text-sm mt-1">Bigger + leaner + more testosterone — in parallel</p>
        </div>
        <button onClick={() => setShowLog(true)} className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" /> Log Today
        </button>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Current Weight', value: `${currentWeight} kg`, sub: '↓ 2.2kg lost' },
          { label: 'Body Fat %', value: `${currentBF}%`, sub: 'Goal: sub 10%' },
          { label: 'Lean Mass', value: `${leanMassKg.toFixed(1)} kg`, sub: 'Protect this' },
          { label: 'Fat Left to Lose', value: `${fatToLose.toFixed(1)} kg`, sub: `Target: ${targetWeight.toFixed(1)}kg` },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-neutral-600 mt-1">{s.label}</p>
            <p className="text-xs text-neutral-700 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recomp blueprint */}
      <div className="card border-blue-950/50">
        <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" /> The Recomp Blueprint
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1.5">
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Daily Targets</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-neutral-600">Calories</span><span className="text-white font-semibold">2,500 kcal</span></div>
              <div className="flex justify-between"><span className="text-neutral-600">Protein</span><span className="text-white font-semibold">200g minimum</span></div>
              <div className="flex justify-between"><span className="text-neutral-600">Rate of loss</span><span className="text-white font-semibold">~0.5kg/week</span></div>
              <div className="flex justify-between"><span className="text-neutral-600">Creatine</span><span className="text-white font-semibold">5g/day</span></div>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Timeline to Sub-10%</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-neutral-600">Fat to lose</span><span className="text-white font-semibold">{fatToLose.toFixed(1)} kg</span></div>
              <div className="flex justify-between"><span className="text-neutral-600">At 0.5kg/wk</span><span className="text-white font-semibold">~{Math.ceil(fatToLose / 0.5)} weeks</span></div>
              <div className="flex justify-between"><span className="text-neutral-600">Est. date</span><span className="text-blue-400 font-semibold">Aug/Sep 2026</span></div>
              <div className="flex justify-between"><span className="text-neutral-600">Race day</span><span className="text-white font-semibold">~12% BF (lean)</span></div>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Muscle Growth</p>
            <div className="space-y-1 text-xs text-neutral-600">
              <p>Progressive overload every session</p>
              <p>Compound lifts — squat, deadlift, press</p>
              <p>Leg day minimum 2×/week</p>
              <p>Creatine 5g/day — non-negotiable</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2"><Scale className="w-4 h-4 text-neutral-500" /> Weight</h2>
            <span className="text-xs text-neutral-600 flex items-center gap-1"><ArrowDown className="w-3 h-3" />2.2 kg</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weightHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#111" />
              <XAxis dataKey="date" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} domain={[78, 84]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={targetWeight} stroke="#1d4ed8" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="weight" name="weight" stroke="#3b82f6" strokeWidth={1.5} fill="url(#wGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2"><Target className="w-4 h-4 text-neutral-500" /> Body Fat %</h2>
            <span className="text-xs text-neutral-600">Goal: sub-10%</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weightHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#111" />
              <XAxis dataKey="date" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} domain={[9, 18]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={10} stroke="#374151" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="bf" name="bf" stroke="#ffffff" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Measurements */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Ruler className="w-4 h-4 text-neutral-500" /> Body Measurements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {measurements.map(m => {
            const isGrowing = m.part !== 'Waist'
            const progress = isGrowing
              ? ((m.current - m.start) / (m.goal - m.start)) * 100
              : ((m.start - m.current) / (m.start - m.goal)) * 100
            const pct = Math.min(Math.max(progress, 0), 100)
            return (
              <div key={m.part} className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-neutral-500">{m.part}</span>
                  <span className="text-sm font-bold text-white">{m.current}{m.unit}</span>
                </div>
                <div className="h-1 rounded-full bg-[#1a1a1a]">
                  <div className="h-full rounded-full bg-blue-700" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-neutral-700">Start: {m.start}{m.unit}</span>
                  <span className="text-xs text-blue-700">→ {m.goal}{m.unit}</span>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-neutral-700 mt-3">Measure every Sunday, fasted. Waist ↓ = fat loss. Arms/quads ↑ = muscle gain.</p>
      </div>

      {/* ── TESTOSTERONE SECTION ─────────────────────────────── */}
      <div className="card border-[#1a1a2e]">
        {/* Header with live T-score */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="font-bold text-white text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Testosterone Optimisation
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">Natural T can be doubled with consistent lifestyle habits</p>
          </div>
          {/* Live score */}
          <div className="text-right bg-[#0a0f1e] border border-blue-950 rounded-xl px-4 py-3">
            <p className="text-[10px] text-blue-700 uppercase tracking-wider font-semibold">Est. T Multiplier</p>
            <p className="text-3xl font-black text-white">{estimatedTMultiplier}<span className="text-blue-600 text-lg">×</span></p>
            <p className="text-[10px] text-neutral-700">{checkedCount} habits active</p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4 mb-5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-neutral-600">Protocol completion</span>
            <span className="text-white font-semibold">{checkedCount}/{TESTO_PROTOCOL.length} habits · {highImpactDone}/{highImpactTotal} high-impact</span>
          </div>
          <div className="h-2 rounded-full bg-[#0f0f0f] border border-[#1a1a1a]">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-800 to-blue-500 transition-all duration-500"
              style={{ width: `${(checkedCount / TESTO_PROTOCOL.length) * 100}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-700 mt-1">
            <span>Baseline (1×)</span>
            <span>Natural peak (~2.2×)</span>
          </div>
        </div>

        {/* Protocol checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
          {TESTO_PROTOCOL.map(item => {
            const checked = checkedProtocol.has(item.action)
            return (
              <button
                key={item.action}
                onClick={() => toggleProtocol(item.action)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-150
                  ${checked ? 'bg-[#0a0f1e] border-blue-900/50' : 'bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#2a2a2a]'}`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center flex-none
                  ${checked ? 'bg-blue-600 border-blue-600' : 'border-[#333]'}`}>
                  {checked && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-medium leading-tight ${checked ? 'text-white' : 'text-neutral-400'}`}>
                      {item.action}
                    </p>
                    <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded
                      ${item.impact === 'high' ? 'bg-blue-950 text-blue-400' : 'bg-[#111] text-neutral-600'}`}>
                      +{item.boost}%
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-700 mt-0.5 leading-tight">{item.mechanism}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* T killers */}
        <div>
          <h3 className="text-xs text-neutral-600 uppercase tracking-wider font-semibold mb-3">T Killers — Avoid These</h3>
          <div className="space-y-1.5">
            {T_KILLERS.map(k => (
              <div key={k.thing} className="flex items-center justify-between p-2.5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${k.severity === 'high' ? 'bg-red-800' : 'bg-neutral-700'}`} />
                  <span className="text-xs text-neutral-400 font-medium">{k.thing}</span>
                </div>
                <span className="text-xs text-neutral-600">{k.effect}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-4 p-4 rounded-xl bg-[#0a0f1e] border border-blue-950/50">
          <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-2">Expected Timeline</p>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div><p className="text-white font-bold">4 weeks</p><p className="text-neutral-600">Sleep + zinc = first noticeable improvements</p></div>
            <div><p className="text-white font-bold">8-12 weeks</p><p className="text-neutral-600">Consistent training + diet = 30-50% increase</p></div>
            <div><p className="text-white font-bold">6 months</p><p className="text-neutral-600">Full protocol = 80-120% above baseline</p></div>
          </div>
        </div>
      </div>

      {showLog && <QuickLogModal type="body" onClose={() => setShowLog(false)} />}
    </div>
  )
}
