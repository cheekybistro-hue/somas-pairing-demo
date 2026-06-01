import { supabase } from '@/lib/supabase'

import type {
  KnowledgeModule,
  Progress,
  InternationalConsensus,
  ProfileConsensus,
  Question,
} from './knowledge-types'

export async function loadModulesAndProgress(activeExpertId: string) {
  const { data: moduleData, error: moduleError } = await supabase
    .from('knowledge_modules')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  if (moduleError) {
    throw new Error(moduleError.message)
  }

  const { data: progressData, error: progressError } = await supabase
    .from('expert_module_progress')
    .select('*')
    .eq('expert_id', activeExpertId)

  if (progressError) {
    throw new Error(progressError.message)
  }

  const progressMap: Record<string, Progress> = {}

  ;(progressData ?? []).forEach((item: Progress) => {
    progressMap[item.form_phase] = item
  })

  return {
    modules: moduleData ?? [],
    progress: progressMap,
  }
}

export async function loadConsensusInsights() {
  const { data: internationalData } = await supabase
    .from('v_profile_international_top')
    .select('*')
    .order('votes', { ascending: false })
    .limit(3)

  const { data: profileData } = await supabase
    .from('v_profile_consensus')
    .select('*')
    .order('votes', { ascending: false })
    .limit(3)

  return {
    internationalConsensus:
      (internationalData ?? []) as InternationalConsensus[],
    profileConsensus:
      (profileData ?? []) as ProfileConsensus[],
  }
}

export async function startKnowledgeModule(
  expertId: string,
  module: KnowledgeModule,
  progress: Record<string, Progress>
) {
  const { data: loadedQuestions, error: questionsError } = await supabase
    .from('knowledge_questions')
    .select('*')
    .eq('active', true)
    .eq('form_phase', module.form_phase)
    .order('priority')

  if (questionsError) {
    throw new Error(questionsError.message)
  }

  const moduleQuestions = (loadedQuestions ?? []) as Question[]
  const existingProgress = progress[module.form_phase]

  const resumeIndex = Math.min(
    existingProgress?.questions_answered ?? 0,
    Math.max(moduleQuestions.length - 1, 0)
  )

  const { data: session, error: sessionError } = await supabase
    .from('knowledge_sessions')
    .insert({
      expert_id: expertId,
      status: 'started',
    })
    .select('id')
    .single()

  if (sessionError) {
    throw new Error(sessionError.message)
  }

  await supabase.from('expert_module_progress').upsert(
    {
      expert_id: expertId,
      form_phase: module.form_phase,
      status:
        existingProgress?.status === 'completed'
          ? 'completed'
          : 'in_progress',
      questions_answered:
        existingProgress?.questions_answered ?? 0,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'expert_id,form_phase',
    }
  )

  await supabase.from('interview_messages').insert({
    session_id: session.id,
    expert_id: expertId,
    role: 'assistant',
    form_phase: module.form_phase,
    knowledge_target: module.module_code,
    message: `Início do módulo ${module.module_name}.`,
  })

  return {
    sessionId: session.id,
    questions: moduleQuestions,
    resumeIndex,
  }
}
