import { supabase } from '@/lib/supabase'

export async function loadModuleAnswers(
  expertId: string,
  formPhase: string
) {
  const { data: questions, error: questionsError } =
    await supabase
      .from('knowledge_questions')
      .select('question_code')
      .eq('active', true)
      .eq('form_phase', formPhase)

  if (questionsError) {
    throw new Error(questionsError.message)
  }

  const questionCodes =
    (questions ?? [])
      .map((question) => question.question_code)
      .filter(Boolean)

  if (questionCodes.length === 0) {
    return []
  }

  const { data, error } = await supabase
    .from('knowledge_answers')
    .select('*')
    .eq('expert_id', expertId)
    .in('question_code', questionCodes)
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}
