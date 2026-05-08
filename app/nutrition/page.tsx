'use client'

import { useState } from 'react'
import { Apple, Droplets, Target, TrendingUp, Plus, CheckCircle2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import QuickLogModal from '@/components/QuickLogModal'

const weeklyNutrition = [
  { day: 'Mon', calories: 2480, protein: 198, carbs: 240, fat: 82 },
  { day: 'Tue', calories: 2620, protein: 215, carbs: 260, fat: 88 },
  { day: 'Wed', calories: 2390, protein: 192, carbs: 230, fat: 78 },
  { day: 'Thu', calories: 2550, protein: 205, carbs: 255, fat: 85 },
  { day: 'Fri', calories: 2500, protein: 200, carbs: 248, fat: 83 },
  { day: 'Sat', calories: 2700, protein: 210, carbs: 280, fat: 90 },
  { day: 'Sun', calories: 0, protein: 0, carbs: 0, fat: 0 },
]

const macroTargets = {
  calories: 2500,
  protein: 200,
  carbs: 250,
  fat: 83,
}

const todayNutrition = {
  calories: 1840,
  protein: 148,
  carbs: 180,
  fat: 62,
  water: 2200,
}

const SUPPLEMENT_STACK = [
  { name: 'Creatine Monohydrate', dose: '5g', timing: 'Any time with water', purpose: 'Strength + muscle retention', essential: true },
  { name: 'Vitamin D3 + K2', dose: '5000IU D3 / 100mcg K2', timing: 'Morning with fat', purpose: 'Testosterone + bone health', essential: true },
  { name: 'Zinc', dose: '25-30mg', timing: 'Before bed', purpose: 'Testosterone production', essential: true },
  { name: 'Magnesium Glycinate', dose: '400mg', timing: 'Before bed', purpose: 'Sleep quality + T production', essential: true },
  { name: 'Fish Oil (Omega-3)', dose: '3g EPA/DHA', timing: 'With meals', purpose: 'Anti-inflammatory + heart', essential: true },
  { name: 'Ashwagandha KSM-66', dose: '600mg', timing: 'Evening', purpose: 'Cortisol control + T boost', essential: false },
  { name: 'Caffeine (pre-workout)', dose: '200mg', timing: '30min pre-session', purpose: 'Performance', essential: false },
  { name: 'Collagen + Vitamin C', dose: '15g + 500mg', timing: 'Pre-workout', purpose: 'Joint health', essential: false },
]

const MEAL_PLAN = [
  {
    meal: 'Breakfast',
    time: '7:00am',
    foods: ['5 whole eggs scrambled', '200g Greek yoghurt (0% fat)', '100g oats with berries'],
    macros: { calories: 680, protein: 55, carbs: 70, fat: 22 },
  },
  {
    meal: 'Lunch',
    time: '12:30pm',
    foods: ['200g chicken breast or mince', '250g white rice', '200g broccoli + olive oil'],
    macros: { calories: 650, protein: 58, carbs: 75, fat: 14 },
  },
  {
    meal: 'Pre-Workout',
    time: '4:30pm',
    foods: ['1 banana', '30g whey protein with water', '30g rice cakes'],
    macros: { calories: 320, protein: 30, carbs: 52, fat: 3 },
  },
  {
    meal: 'Post-Workout',
    time: '7:00pm',
    foods: ['200g salmon or beef mince', '250g sweet potato', 'Salad with olive oil'],
    macros: { calories: 720, protein: 52, carbs: 48, fat: 32 },
  },
  {
    meal: 'Before Bed',
    time: '9:30pm',
    foods: ['200g cottage cheese', '30g casein protein (optional)', 'ZMA supplements'],
    macros: { calories: 220, protein: 38, carbs: 8, fat: 4 },
  },
]

const macroDistribution = [
  { name: 'Protein', value: 32, color: '#00f5ff' },
  { name: 'Carbs', value: 40, color: '#a855f7' },
  { name: 'Fat', value: 28, color: '#ff6b35' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="font-semibold text-xs" style={{ color: p.color }}>{p.name}: {p.value}{p.name === 'calories' ? 'kcal' : 'g'}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function NutritionPage() {
  const [showLog, setShowLog] = useState(false)
  const [takenSupps, setTakenSupps] = useState<Set<string>>(new Set())

  const caloriesRemaining = macroTargets.calories - todayNutrition.calories
  const proteinRemaining = macroTargets.protein - todayNutrition.protein
  const proteinPct = Math.round((todayNutrition.protein / macroTargets.protein) * 100)
  const caloriePct = Math.round((todayNutrition.calories / macroTargets.calories) * 100)
  const waterPct = Math.round((todayNutrition.water / 3000) * 100)

  const toggleSupp = (name: string) => {
    setTakenSupps(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  return (
    <div className="animate-fade-in space-y-6 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Apple className="w-7 h-7 text-brand-green" />
            Nutrition
          </h1>
          <p className="text-gray-500 text-sm mt-1">Protein is the priority. Everything else follows.</p>
        </div>
        <button onClick={() => setShowLog(true)} className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Log Today
        </button>
      </div>

      {/* Today's macros */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4">Today's Progress</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MacroRing label="Calories" current={todayNutrition.calories} target={macroTargets.calories} unit="kcal" color="text-brand-orange" pct={caloriePct} />
          <MacroRing label="Protein" current={todayNutrition.protein} target={macroTargets.protein} unit="g" color="text-brand-cyan" pct={proteinPct} />
          <MacroRing label="Carbs" current={todayNutrition.carbs} target={macroTargets.carbs} unit="g" color="text-brand-purple" pct={Math.round(todayNutrition.carbs / macroTargets.carbs * 100)} />
          <MacroRing label="Water" current={todayNutrition.water} target={3000} unit="ml" color="text-blue-400" pct={waterPct} />
        </div>

        {proteinPct < 100 && (
          <div className="mt-4 p-3 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-sm">
            <span className="text-brand-orange font-semibold">⚡ {proteinRemaining}g protein still to hit today. </span>
            <span className="text-gray-400">
              Add a {Math.ceil(proteinRemaining / 30)}-scoop shake ({Math.ceil(proteinRemaining / 30) * 30}g protein) or {Math.ceil(proteinRemaining / 25)}×100g chicken breast.
            </span>
          </div>
        )}
      </div>

      {/* Weekly protein chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Weekly Protein (g)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyNutrition} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 250]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="protein" name="protein" fill="#00f5ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 mt-2">Target: 200g every day. Non-negotiable for muscle retention.</p>
        </div>

        <div className="card">
          <h2 className="font-semibold text-white mb-4">Macro Split Target</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={macroDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {macroDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconSize={8} iconType="circle" formatter={(value) => (
                  <span style={{ color: '#888', fontSize: '12px' }}>{value}</span>
                )} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Meal plan */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-green" />
          Daily Meal Structure
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          This hits 2,590kcal / 233g protein / 253g carbs / 75g fat. Adjust portions to hit exact targets.
        </p>
        <div className="space-y-3">
          {MEAL_PLAN.map(meal => (
            <div key={meal.meal} className="flex gap-3 p-4 rounded-xl bg-dark-600/40 border border-dark-500">
              <div className="w-20 flex-shrink-0">
                <p className="text-xs font-bold text-brand-green">{meal.meal}</p>
                <p className="text-xs text-gray-600">{meal.time}</p>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-1 mb-2">
                  {meal.foods.map(food => (
                    <span key={food} className="text-xs bg-dark-500 text-gray-300 px-2 py-0.5 rounded-lg">{food}</span>
                  ))}
                </div>
                <div className="flex gap-3 text-xs text-gray-600">
                  <span className="text-brand-orange">{meal.macros.calories}kcal</span>
                  <span className="text-brand-cyan">{meal.macros.protein}g P</span>
                  <span className="text-brand-purple">{meal.macros.carbs}g C</span>
                  <span className="text-brand-orange opacity-70">{meal.macros.fat}g F</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supplement stack */}
      <div className="card">
        <h2 className="font-semibold text-white mb-2 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-brand-cyan" />
          Supplement Stack
        </h2>
        <p className="text-xs text-gray-500 mb-4">Tick what you've taken today</p>
        <div className="space-y-2">
          {SUPPLEMENT_STACK.map(supp => {
            const taken = takenSupps.has(supp.name)
            return (
              <button
                key={supp.name}
                onClick={() => toggleSupp(supp.name)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200
                  ${taken ? 'bg-brand-cyan/10 border-brand-cyan/20' : 'bg-dark-600/30 border-dark-500 hover:border-dark-400'}`}
              >
                <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2
                  ${taken ? 'bg-brand-cyan border-brand-cyan' : 'border-dark-300'}`}>
                  {taken && <span className="text-black text-xs font-bold">✓</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${taken ? 'text-brand-cyan' : 'text-gray-300'}`}>{supp.name}</span>
                    {supp.essential && <span className="badge bg-brand-orange/10 text-brand-orange border border-brand-orange/20 text-xs">Essential</span>}
                  </div>
                  <div className="flex gap-3 mt-0.5 text-xs text-gray-500">
                    <span>{supp.dose}</span>
                    <span>·</span>
                    <span>{supp.timing}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-600 hidden md:block">{supp.purpose}</span>
              </button>
            )
          })}
        </div>
      </div>

      {showLog && <QuickLogModal type="nutrition" onClose={() => setShowLog(false)} />}
    </div>
  )
}

function MacroRing({ label, current, target, unit, color, pct }: {
  label: string; current: number; target: number; unit: string; color: string; pct: number
}) {
  return (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-2">
        <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
          <circle cx="40" cy="40" r="32" fill="none" stroke="#222" strokeWidth="8" />
          <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor"
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${Math.min(pct, 100) * 2.01} 201`}
            className={color} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${color}`}>{pct}%</span>
        </div>
      </div>
      <p className="text-lg font-bold text-white">{current}</p>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xs text-gray-600">/{target} {unit}</p>
    </div>
  )
}
