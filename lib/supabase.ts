import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getRecentWorkouts(userId: string, days = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', since.toISOString().split('T')[0])
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function getRecentBodyLogs(userId: string, days = 90) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const { data, error } = await supabase
    .from('body_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', since.toISOString().split('T')[0])
    .order('date', { ascending: true })
  if (error) throw error
  return data
}

export async function getRecentNutrition(userId: string, days = 14) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const { data, error } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', since.toISOString().split('T')[0])
    .order('date', { ascending: true })
  if (error) throw error
  return data
}

export async function getRecentRecovery(userId: string, days = 14) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const { data, error } = await supabase
    .from('recovery_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', since.toISOString().split('T')[0])
    .order('date', { ascending: true })
  if (error) throw error
  return data
}

export async function getFinanceLogs(userId: string) {
  const { data, error } = await supabase
    .from('finance_logs')
    .select('*')
    .eq('user_id', userId)
    .order('month', { ascending: true })
  if (error) throw error
  return data
}

export async function logWorkout(userId: string, workout: Partial<import('./types').WorkoutLog>) {
  const { data, error } = await supabase
    .from('workout_logs')
    .insert({ ...workout, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function logBody(userId: string, body: Partial<import('./types').BodyLog>) {
  const { data, error } = await supabase
    .from('body_logs')
    .upsert({ ...body, user_id: userId }, { onConflict: 'user_id,date' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function logNutrition(userId: string, nutrition: Partial<import('./types').NutritionLog>) {
  const { data, error } = await supabase
    .from('nutrition_logs')
    .upsert({ ...nutrition, user_id: userId }, { onConflict: 'user_id,date' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function logStrength(userId: string, entry: Partial<import('./types').StrengthLog>) {
  const { data, error } = await supabase
    .from('strength_logs')
    .insert({ ...entry, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function logRecovery(userId: string, recovery: Partial<import('./types').RecoveryLog>) {
  const { data, error } = await supabase
    .from('recovery_logs')
    .upsert({ ...recovery, user_id: userId }, { onConflict: 'user_id,date' })
    .select()
    .single()
  if (error) throw error
  return data
}
