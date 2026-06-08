import { supabase } from '@/lib/supabase'

export async function loadModuleAnswers(
  expertId: string,
  formPhase: string
) {
  const { data, error } = await supabase
    .from('knowledge_answers')
    .select('*')
    .eq('expert_id', expertId)
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).filter(
    (answer) =>
      answer.question_code?.startsWith(
        formPhase.toUpperCase()
      )
  )
}
