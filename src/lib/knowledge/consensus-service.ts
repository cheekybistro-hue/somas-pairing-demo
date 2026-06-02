import { supabase } from '@/lib/supabase'
import {
  calculateConsensus,
  type ConsensusInputAnswer,
} from './consensus-engine'

export async function loadAnswersForConsensus() {
  const { data, error } = await supabase
    .from('knowledge_answers')
    .select('question_code, answer_text, answer_json, confidence')

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((item: any) => ({
    question_code: item.question_code,
    question_type: item.answer_json?.question_type ?? 'unknown',
    answer_text: item.answer_text,
    answer_json: item.answer_json,
    confidence: item.confidence,
  })) as ConsensusInputAnswer[]
}

export async function buildConsensusSnapshot() {
  const answers = await loadAnswersForConsensus()

  return calculateConsensus(answers)
}
