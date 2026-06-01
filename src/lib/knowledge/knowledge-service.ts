import { supabase } from '@/lib/supabase'
import type {
  Progress,
  InternationalConsensus,
  ProfileConsensus,
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
