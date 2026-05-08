'use client'

import { useState } from 'react'
import { Dumbbell, TrendingUp, Plus, Trophy, Zap, Target } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'

const KEY_LIFTS = [
  { name: 'Back Squat', current1RM: 120, target1RM: 160, unit: 'kg', hyroxRelevance: 'Sled Push/Pull + Running Power', icon: '🏋️' },
  { name: 'Romanian Deadlift', current1RM: 130, target1RM: 170, unit: 'kg', hyroxRelevance: 'Sled Pull + Sandbag Lunges', icon: '💪' },
  { name: 'Leg Press', current1RM: 200, target1RM: 280, unit: 'kg', hyroxRelevance: 'Leg power + sled', icon: '🦵' },
  { name: 'Hip Thrust', current1RM: 140, target1RM: 180, unit: 'kg', hyroxRelevance: 'Glute power for sprinting', icon: '🔥' },
  { name: 'Bench Press', current1RM: 100, target1RM: 130, unit: 'kg', hyroxRelevance: 'Upper body mass', icon: '💪' },
  { name: 'Weighted Pull-up', current1RM: 30, target1RM: 50, unit: 'kg added', hyroxRelevance: 'SkiErg + Row power', icon: '🏃' },
]

const squat_history = [
  { week: 'W1', weight: 100 }, { week: 'W2', weight: 105 },
  { week: 'W3', weight: 107.5 }, { week: 'W4', weight: 110 },
  { week: 'W5', weight: 115 }, { week: 'W6', weight: 120 },
]

const LEG_PROGRAMME = [
  {
    day: 'Leg Day A — Power',
    frequency: '2x per week',
    exercises: [
      { name: 'Back Squat', sets: '4', reps: '5', load: 'Heavy (85% 1RM)', rest: '3min' },
      { name: 'Romanian Deadlift', sets: '4', reps: '6', load: 'Heavy (80% 1RM)', rest: '2.5min' },
      { name: 'Bulgarian Split Squat', sets: '3', reps: '8 each', load: 'Moderate', rest: '2min' },
      { name: 'Leg Press', sets: '3', reps: '12', load: 'Moderate-heavy', rest: '2min' },
      { name: 'Calf Raises', sets: '4', reps: '15', load: 'Heavy', rest: '90s' },
    ],
  },
  {
    day: 'Leg Day B — Hypertrophy',
    frequency: 'Once per week',
    exercises: [
      { name: 'Hack Squat', sets: '4', reps: '10-12', load: 'Moderate (drop sets last set)', rest: '2min' },
      { name: 'Hip Thrust', sets: '4', reps: '10', load: 'Heavy', rest: '2min' },
      { name: 'Walking Lunges', sets: '3', reps: '20 steps', load: 'Moderate (mimics Hyrox)', rest: '2min' },
      { name: 'Leg Extension', sets: '3', reps: '15', load: 'Moderate', rest: '90s' },
      { name: 'Leg Curl', sets: '3', reps: '12', load: 'Moderate', rest: '90s' },
      { name: 'Nordic Curls', sets: '3', reps: '5-8', load: 'Bodyweight (injury prevention)', rest: '2min' },
    ],
  },
]

const weeklyLiftVolume = [
  { week: 'Apr W1', squat: 8500, rdl: 7200, press: 5400 },
  { week: 'Apr W2', squat: 9200, rdl: 7800, press: 5800 },
  { week: 'Apr W3', squat: 10100, rdl: 8400, press: 6200 },
  { week: 'Apr W4', squat: 11000, rdl: 9100, press: 6800 },
  { week: 'May W1', squat: 12000, rdl: 10000, press: 7500 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="font-semibold text-xs" style={{ color: p.color }}>{p.name}: {p.value}kg</p>
        ))}
      </div>
    )
  }
  return null
}

export default function StrengthPage() {
  const [logEntry, setLogEntry] = useState({ exercise: '', sets: '', reps: '', weight: '' })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="animate-fade-in space-y-6 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Dumbbell className="w-7 h-7 text-brand-purple" />
            Strength Tracker
          </h1>
          <p className="text-gray-500 text-sm mt-1">Leg strength = Hyrox weapon. Every kg matters.</p>
        </div>
      </div>

      {/* Why legs */}
      <div className="card bg-gradient-to-r from-brand-purple/5 to-brand-cyan/5 border-brand-purple/20">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-brand-purple mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm">Why legs are your #1 priority</p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              5 of 8 Hyrox stations are leg-dominant: Sled Push, Sled Pull, Burpee Broad Jumps, Sandbag Lunges, and all 8 runs.
              Stronger legs = faster sleds, better endurance, more explosive runs. Add 20kg to your squat and you'll shave 2-3 minutes off your finish time.
            </p>
          </div>
        </div>
      </div>

      {/* PR board */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-brand-orange" />
          Lift PRs → Hyrox Performance
        </h2>
        <div className="space-y-3">
          {KEY_LIFTS.map(lift => {
            const pct = Math.round((lift.current1RM / lift.target1RM) * 100)
            return (
              <div key={lift.name} className="flex items-center gap-3 p-3 rounded-xl bg-dark-600/40 border border-dark-500">
                <span className="text-xl w-8">{lift.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{lift.name}</span>
                    <span className="text-xs text-gray-500">{lift.current1RM} → <span className="text-brand-cyan">{lift.target1RM} {lift.unit}</span></span>
                  </div>
                  <div className="h-1.5 rounded-full bg-dark-400 overflow-hidden">
                    <div className="h-full rounded-full bg-brand-purple" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{lift.hyroxRelevance}</p>
                </div>
                <span className="text-xs font-bold text-brand-purple">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick log */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-cyan" />
          Log a Set
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="label-muted mb-1.5 block">Exercise</label>
            <input placeholder="Back Squat" value={logEntry.exercise}
              onChange={e => setLogEntry(p => ({ ...p, exercise: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label-muted mb-1.5 block">Sets</label>
            <input type="number" placeholder="4" value={logEntry.sets}
              onChange={e => setLogEntry(p => ({ ...p, sets: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label-muted mb-1.5 block">Reps</label>
            <input type="number" placeholder="6" value={logEntry.reps}
              onChange={e => setLogEntry(p => ({ ...p, reps: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label-muted mb-1.5 block">Weight (kg)</label>
            <input type="number" placeholder="120" value={logEntry.weight}
              onChange={e => setLogEntry(p => ({ ...p, weight: e.target.value }))} className="input-field" />
          </div>
        </div>
        <button onClick={handleSave} className={`btn-primary mt-3 ${saved ? 'bg-brand-green text-black' : ''}`}>
          {saved ? '✓ Logged!' : 'Log Set'}
        </button>
      </div>

      {/* Squat progression chart */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-purple" />
          Squat Progression
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={squat_history} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis dataKey="week" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} domain={[90, 130]} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="weight" name="Squat (kg)" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-600 mt-2">Progressive overload: +2.5kg when you hit all reps clean.</p>
      </div>

      {/* Leg programme */}
      <div className="space-y-4">
        {LEG_PROGRAMME.map(programme => (
          <div key={programme.day} className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">{programme.day}</h2>
              <span className="badge bg-brand-purple/10 text-brand-purple border border-brand-purple/20 text-xs">
                {programme.frequency}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600 text-xs uppercase tracking-wider">
                    <th className="text-left pb-2">Exercise</th>
                    <th className="text-center pb-2">Sets</th>
                    <th className="text-center pb-2">Reps</th>
                    <th className="text-left pb-2 hidden md:table-cell">Load</th>
                    <th className="text-center pb-2 hidden md:table-cell">Rest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-500">
                  {programme.exercises.map(ex => (
                    <tr key={ex.name} className="hover:bg-dark-600/30 transition-colors">
                      <td className="py-2.5 text-white font-medium">{ex.name}</td>
                      <td className="py-2.5 text-center text-brand-cyan font-bold">{ex.sets}</td>
                      <td className="py-2.5 text-center text-gray-300">{ex.reps}</td>
                      <td className="py-2.5 text-gray-500 text-xs hidden md:table-cell">{ex.load}</td>
                      <td className="py-2.5 text-center text-gray-600 text-xs hidden md:table-cell">{ex.rest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
