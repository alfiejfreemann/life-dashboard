export interface WorkoutLog {
  id: string
  user_id: string
  date: string
  type: 'hyrox_sim' | 'run' | 'strength' | 'zone2' | 'bike' | 'swim' | 'rest' | 'other'
  duration_mins: number
  distance_km?: number
  avg_hr?: number
  avg_pace_min_km?: number
  notes?: string
  created_at: string
}

export interface BodyLog {
  id: string
  user_id: string
  date: string
  weight_kg: number
  body_fat_pct?: number
  waist_cm?: number
  chest_cm?: number
  left_arm_cm?: number
  right_arm_cm?: number
  left_quad_cm?: number
  right_quad_cm?: number
  notes?: string
  created_at: string
}

export interface StrengthLog {
  id: string
  user_id: string
  date: string
  exercise: string
  sets: number
  reps: number
  weight_kg: number
  notes?: string
  created_at: string
}

export interface NutritionLog {
  id: string
  user_id: string
  date: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  water_ml: number
  notes?: string
  created_at: string
}

export interface RecoveryLog {
  id: string
  user_id: string
  date: string
  hrv?: number
  sleep_hrs?: number
  sleep_score?: number
  energy_level: number
  mood: number
  notes?: string
  created_at: string
}

export interface FinanceLog {
  id: string
  user_id: string
  month: string
  online_income_gbp: number
  source: string
  notes?: string
  created_at: string
}

export interface HabitLog {
  id: string
  user_id: string
  date: string
  habits: Record<string, boolean>
  created_at: string
}

export type GoalStatus = 'on_track' | 'at_risk' | 'crushing_it' | 'behind'

export interface Goal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  deadline: string
  category: 'fitness' | 'body' | 'finance' | 'career' | 'health'
  status: GoalStatus
}
