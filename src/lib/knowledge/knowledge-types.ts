export type KnowledgeModule = {
  module_code: string
  module_name: string
  description: string | null
  form_phase: string
  sort_order: number
  estimated_questions: number
  active: boolean
}

export type Progress = {
  form_phase: string
  status: string
  questions_answered: number
  completed_at: string | null
  updated_at?: string | null
}

export type InternationalConsensus = {
  wine_profile_code: string
  region_style: string
  votes: number
}

export type ProfileConsensus = {
  source_profile: string
  target_profile: string
  votes: number
}

export type Question = {
  question_code: string
  form_phase: string
  question_type: string
  food_archetype_code: string | null
  wine_profile_code: string | null
  question_text: string
  helper_text: string | null
  priority: number
}
