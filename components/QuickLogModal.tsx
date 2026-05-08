'use client'

import { useState } from 'react'
import { X, Dumbbell, TrendingUp, Apple } from 'lucide-react'

interface Props {
  type: 'workout' | 'body' | 'nutrition'
  onClose: () => void
}

export default function QuickLogModal({ type, onClose }: Props) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(onClose, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:max-w-md bg-dark-700 border border-dark-500 rounded-t-3xl md:rounded-3xl p-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {type === 'workout' && <Dumbbell className="w-5 h-5 text-brand-cyan" />}
            {type === 'body' && <TrendingUp className="w-5 h-5 text-brand-green" />}
            {type === 'nutrition' && <Apple className="w-5 h-5 text-brand-orange" />}
            <h2 className="font-semibold text-white">
              {type === 'workout' ? 'Log Workout' : type === 'body' ? 'Log Body Stats' : 'Log Nutrition'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {type === 'workout' && <WorkoutForm onSave={handleSave} saved={saved} />}
        {type === 'body' && <BodyForm onSave={handleSave} saved={saved} />}
        {type === 'nutrition' && <NutritionForm onSave={handleSave} saved={saved} />}
      </div>
    </div>
  )
}

function WorkoutForm({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'run',
    duration_mins: '',
    distance_km: '',
    avg_hr: '',
    notes: '',
  })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-muted mb-1.5 block">Date</label>
          <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-muted mb-1.5 block">Type</label>
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="select-field">
            <option value="run">Run</option>
            <option value="hyrox_sim">Hyrox Sim</option>
            <option value="strength">Strength</option>
            <option value="zone2">Zone 2</option>
            <option value="bike">Bike</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label-muted mb-1.5 block">Duration (min)</label>
          <input type="number" placeholder="60" value={form.duration_mins}
            onChange={e => setForm(p => ({ ...p, duration_mins: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-muted mb-1.5 block">Distance (km)</label>
          <input type="number" placeholder="10.0" value={form.distance_km}
            onChange={e => setForm(p => ({ ...p, distance_km: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-muted mb-1.5 block">Avg HR</label>
          <input type="number" placeholder="155" value={form.avg_hr}
            onChange={e => setForm(p => ({ ...p, avg_hr: e.target.value }))} className="input-field" />
        </div>
      </div>
      <div>
        <label className="label-muted mb-1.5 block">Notes</label>
        <textarea placeholder="How did it feel? PRs? Key observations..." value={form.notes}
          onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          className="input-field resize-none h-20" />
      </div>
      <button onClick={onSave} className={`btn-primary w-full justify-center flex items-center gap-2 ${saved ? 'bg-brand-green text-black' : ''}`}>
        {saved ? '✓ Saved!' : 'Save Workout'}
      </button>
    </div>
  )
}

function BodyForm({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight_kg: '',
    body_fat_pct: '',
    waist_cm: '',
    notes: '',
  })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-muted mb-1.5 block">Date</label>
          <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-muted mb-1.5 block">Weight (kg)</label>
          <input type="number" step="0.1" placeholder="80.2" value={form.weight_kg}
            onChange={e => setForm(p => ({ ...p, weight_kg: e.target.value }))} className="input-field" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-muted mb-1.5 block">Body Fat %</label>
          <input type="number" step="0.1" placeholder="14.2" value={form.body_fat_pct}
            onChange={e => setForm(p => ({ ...p, body_fat_pct: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-muted mb-1.5 block">Waist (cm)</label>
          <input type="number" step="0.5" placeholder="78" value={form.waist_cm}
            onChange={e => setForm(p => ({ ...p, waist_cm: e.target.value }))} className="input-field" />
        </div>
      </div>
      <div>
        <label className="label-muted mb-1.5 block">Notes</label>
        <textarea placeholder="Morning fasted? Post-workout? Observations..." value={form.notes}
          onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          className="input-field resize-none h-16" />
      </div>
      <button onClick={onSave} className={`btn-primary w-full justify-center flex items-center gap-2 ${saved ? 'bg-brand-green text-black' : ''}`}>
        {saved ? '✓ Saved!' : 'Save Body Stats'}
      </button>
    </div>
  )
}

function NutritionForm({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
    water_ml: '',
  })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-muted mb-1.5 block">Date</label>
          <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-muted mb-1.5 block">Calories</label>
          <input type="number" placeholder="2400" value={form.calories}
            onChange={e => setForm(p => ({ ...p, calories: e.target.value }))} className="input-field" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label-muted mb-1.5 block">Protein (g)</label>
          <input type="number" placeholder="200" value={form.protein_g}
            onChange={e => setForm(p => ({ ...p, protein_g: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-muted mb-1.5 block">Carbs (g)</label>
          <input type="number" placeholder="250" value={form.carbs_g}
            onChange={e => setForm(p => ({ ...p, carbs_g: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-muted mb-1.5 block">Fat (g)</label>
          <input type="number" placeholder="80" value={form.fat_g}
            onChange={e => setForm(p => ({ ...p, fat_g: e.target.value }))} className="input-field" />
        </div>
      </div>
      <div>
        <label className="label-muted mb-1.5 block">Water (ml)</label>
        <input type="number" placeholder="3000" value={form.water_ml}
          onChange={e => setForm(p => ({ ...p, water_ml: e.target.value }))} className="input-field" />
      </div>
      <button onClick={onSave} className={`btn-primary w-full justify-center flex items-center gap-2 ${saved ? 'bg-brand-green text-black' : ''}`}>
        {saved ? '✓ Saved!' : 'Save Nutrition'}
      </button>
    </div>
  )
}
