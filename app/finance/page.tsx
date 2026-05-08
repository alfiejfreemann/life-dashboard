'use client'

import { useState } from 'react'
import {
  DollarSign, TrendingUp, Target, Plus, Briefcase,
  Globe, MapPin, CheckCircle2, Circle, ChevronRight
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const incomeHistory = [
  { month: 'Nov', income: 0 },
  { month: 'Dec', income: 200 },
  { month: 'Jan', income: 480 },
  { month: 'Feb', income: 820 },
  { month: 'Mar', income: 1100 },
  { month: 'Apr', income: 1450 },
]

const INCOME_MILESTONES = [
  { amount: 500, label: 'First £500/mo', achieved: true },
  { amount: 1000, label: '£1k/mo — covers food', achieved: true },
  { amount: 1450, label: '£1,450/mo — current', achieved: true },
  { amount: 2500, label: '£2.5k/mo — pays rent', achieved: false },
  { amount: 5000, label: '£5k/mo — half way', achieved: false },
  { amount: 7500, label: '£7.5k/mo — serious money', achieved: false },
  { amount: 10000, label: '£10k/mo — THE GOAL', achieved: false },
]

const INCOME_STREAMS = [
  {
    name: 'Online Coaching',
    description: 'Personal training / fitness coaching online — Hyrox prep, body recomp',
    monthly: 800,
    scalability: 'Medium — time for money but high margins',
    action: 'Get 2 more clients at £150/mo each. Leverage your Hyrox journey as proof.',
    color: 'brand-cyan',
  },
  {
    name: 'Content / Social Media',
    description: 'Instagram / TikTok — document the Hyrox journey, body transformation',
    monthly: 200,
    scalability: 'High — asymmetric upside',
    action: 'Post daily. Gym content, Hyrox training, body transformation. Sydney content is gold.',
    color: 'brand-purple',
  },
  {
    name: 'Digital Products',
    description: 'Hyrox training programs, body recomp guides, ebooks',
    monthly: 300,
    scalability: 'Very High — passive income',
    action: 'Build a £97 Hyrox sub-60 training program. Sell to your audience.',
    color: 'brand-green',
  },
  {
    name: 'Affiliate / Referrals',
    description: 'Supplement brands, gym equipment, Garmin, protein etc.',
    monthly: 150,
    scalability: 'Medium — needs audience',
    action: 'Apply to Myprotein, Garmin, or SiS affiliates. Link in bio.',
    color: 'brand-orange',
  },
]

const GYM_JOB_ACTIONS = [
  { action: 'Get Level 3 PT certificate confirmed / valid in Australia', done: false },
  { action: 'Research top gyms in Sydney — F45, Hyrox gyms, CrossFit, Fitness First', done: false },
  { action: 'Build a strong Instagram showing Hyrox training + coaching', done: false },
  { action: 'Create a 1-page PT portfolio / bio PDF to send to gyms', done: false },
  { action: 'DM 5 Sydney gym owners directly on Instagram this week', done: false },
  { action: 'Apply via gym websites + LinkedIn for PT floor roles', done: false },
  { action: 'Prepare for Hyrox Sydney — competing there builds local credibility', done: false },
  { action: 'Network at the Hyrox event in Sydney — other coaches, gym owners', done: false },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-brand-green font-semibold">£{payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function FinancePage() {
  const [gymActions, setGymActions] = useState<Set<number>>(new Set())
  const [newIncome, setNewIncome] = useState({ source: '', amount: '', month: new Date().toISOString().slice(0, 7) })
  const [saved, setSaved] = useState(false)

  const currentIncome = 1450
  const target = 10000
  const pct = Math.round((currentIncome / target) * 100)
  const weeksToTarget = Math.round(
    Math.log(target / currentIncome) / Math.log(1.15) * 4
  )

  const toggleGymAction = (idx: number) => {
    setGymActions(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="animate-fade-in space-y-6 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-brand-green" />
            Finance & Career
          </h1>
          <p className="text-gray-500 text-sm mt-1">£10k/month online income + gym job in Sydney, June 2026</p>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-green">£{currentIncome.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Online Income/mo</p>
          <p className="text-xs text-gray-600 mt-0.5">April 2026</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-white">{pct}%</p>
          <p className="text-xs text-gray-500 mt-1">To £10k goal</p>
          <p className="text-xs text-gray-600 mt-0.5">£{(target - currentIncome).toLocaleString()} to go</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-orange">~15%</p>
          <p className="text-xs text-gray-500 mt-1">Monthly Growth Rate</p>
          <p className="text-xs text-gray-600 mt-0.5">Last 3 months avg</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-cyan">{Math.max(weeksToTarget, 0)}w</p>
          <p className="text-xs text-gray-500 mt-1">At current growth</p>
          <p className="text-xs text-gray-600 mt-0.5">If 15%/mo continues</p>
        </div>
      </div>

      {/* Income chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-green" />
            Online Income Growth
          </h2>
          <span className="text-brand-green text-sm font-semibold">+{Math.round(((1450 - 820) / 820) * 100)}% in 90 days</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={incomeHistory} margin={{ top: 5, right: 5, left: -5, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `£${v.toLocaleString()}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="income" stroke="#00ff88" strokeWidth={2} fill="url(#incomeGrad)" dot={{ fill: '#00ff88', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Milestones */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-green" />
          Income Milestones
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-dark-400" />
          <div className="space-y-3">
            {INCOME_MILESTONES.map(m => (
              <div key={m.amount} className={`relative flex items-center gap-4 pl-10
                ${m.achieved ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 z-10
                  ${m.achieved ? 'bg-brand-green border-brand-green' : 'bg-dark-700 border-dark-400'}`} />
                <div className={`flex-1 flex items-center justify-between p-2.5 rounded-xl border
                  ${m.achieved ? 'bg-brand-green/10 border-brand-green/20' : 'bg-dark-600/20 border-dark-500'}`}>
                  <span className={`text-sm font-medium ${m.achieved ? 'text-brand-green' : 'text-gray-400'}`}>
                    {m.label}
                  </span>
                  {m.achieved && <CheckCircle2 className="w-4 h-4 text-brand-green" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Income streams */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand-cyan" />
          Income Stream Strategy
        </h2>
        <div className="space-y-3">
          {INCOME_STREAMS.map(stream => (
            <div key={stream.name} className="p-4 rounded-xl bg-dark-600/40 border border-dark-500">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{stream.name}</span>
                    <span className="text-brand-green text-sm font-semibold">£{stream.monthly}/mo</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{stream.description}</p>
                  <div className="p-2 rounded-lg bg-dark-500/50 border border-dark-400">
                    <p className="text-xs text-brand-cyan font-semibold mb-0.5">Next action:</p>
                    <p className="text-xs text-gray-300">{stream.action}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Scalability: {stream.scalability}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gym job Sydney */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-orange" />
            Gym Job Sydney — June 2026
          </h2>
          <span className="text-xs text-gray-500">
            {gymActions.size}/{GYM_JOB_ACTIONS.length} done
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Getting a gym job in Sydney gives you: income on arrival, access to equipment, industry connections, and positions you perfectly in the fitness scene.
        </p>
        <div className="space-y-2">
          {GYM_JOB_ACTIONS.map((item, i) => {
            const done = gymActions.has(i)
            return (
              <button
                key={i}
                onClick={() => toggleGymAction(i)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200
                  ${done ? 'bg-brand-orange/10 border-brand-orange/20' : 'bg-dark-600/30 border-dark-500 hover:border-dark-400'}`}
              >
                {done
                  ? <CheckCircle2 className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
                  : <Circle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                }
                <span className={`text-xs leading-relaxed ${done ? 'text-brand-orange' : 'text-gray-300'}`}>
                  {item.action}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Log income */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-green" />
          Log Monthly Income
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="label-muted mb-1.5 block">Month</label>
            <input type="month" value={newIncome.month}
              onChange={e => setNewIncome(p => ({ ...p, month: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label-muted mb-1.5 block">Source</label>
            <input placeholder="Online coaching" value={newIncome.source}
              onChange={e => setNewIncome(p => ({ ...p, source: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label-muted mb-1.5 block">Amount (£)</label>
            <input type="number" placeholder="1450" value={newIncome.amount}
              onChange={e => setNewIncome(p => ({ ...p, amount: e.target.value }))} className="input-field" />
          </div>
        </div>
        <button onClick={handleSave} className={`btn-primary mt-3 ${saved ? 'bg-brand-green text-black' : ''}`}>
          {saved ? '✓ Logged!' : 'Log Income'}
        </button>
      </div>
    </div>
  )
}
