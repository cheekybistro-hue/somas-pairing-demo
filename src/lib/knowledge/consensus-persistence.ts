import { supabase } from '@/lib/supabase'

export async function loadConsensusSnapshot() {
  const { data, error } = await supabase
    .from('knowledge_consensus')
    .select('*')
    .order('question_code')

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function saveConsensusSnapshot(
  consensus: any[]
) {
  if (consensus.length === 0) {
    return
  }

  const { error } = await supabase
    .from('knowledge_consensus')
    .upsert(
      consensus.map((item) => ({
        question_code: item.question_code,
        question_type: item.question_type,
        winning_answer: item.winning_answer,
        votes: item.votes,
        total_votes: item.total_votes,
        confidence_score: item.confidence_score,
        updated_at: new Date().toISOString(),
      })),
      {
        onConflict: 'question_code,question_type',
      }
    )

  if (error) {
    throw new Error(error.message)
  }
}
