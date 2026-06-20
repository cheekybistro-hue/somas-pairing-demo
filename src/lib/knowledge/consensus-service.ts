import { supabase } from '../supabase'
import {
  calculateConsensus,
  type ConsensusInputAnswer,
  type QuestionConsensusResult,
} from './consensus-engine'

type KnowledgeAnswerRow = {
  question_code: string
  answer_text: string | null
  answer_json: any
  confidence: number | null
}

type QuestionMetaRow = {
  question_code: string
  question_type: string
}

function parseAnswerJson(value: any) {
  if (!value) return {}

  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return {}
    }
  }

  return value
}

function inferQuestionType(
  answer: KnowledgeAnswerRow,
  questionTypes: Map<string, string>
) {
  return (
    questionTypes.get(answer.question_code) ??
    parseAnswerJson(answer.answer_json).question_type ??
    'unknown'
  )
}

export async function loadAnswersForConsensus(): Promise<ConsensusInputAnswer[]> {
  const { data: questions, error: questionsError } = await supabase
    .from('knowledge_questions')
    .select('question_code, question_type')
    .eq('active', true)

  if (questionsError) {
    throw new Error(questionsError.message)
  }

  const questionTypes = new Map<string, string>()

  for (const question of (questions ?? []) as QuestionMetaRow[]) {
    questionTypes.set(question.question_code, question.question_type)
  }

  const { data: answers, error: answersError } = await supabase
    .from('knowledge_answers')
    .select('question_code, answer_text, answer_json, confidence')
    .order('created_at', { ascending: false })

  if (answersError) {
    throw new Error(answersError.message)
  }

  return ((answers ?? []) as KnowledgeAnswerRow[]).map((answer) => ({
    question_code: answer.question_code,
    question_type: inferQuestionType(answer, questionTypes),
    answer_text: answer.answer_text,
    answer_json: parseAnswerJson(answer.answer_json),
    confidence: answer.confidence,
  }))
}

export async function loadConsensusResults(): Promise<QuestionConsensusResult[]> {
  const inputAnswers = await loadAnswersForConsensus()

  console.log(
    'CONSENSUS INPUT ANSWERS',
    inputAnswers.length
  )

  const results =
    calculateConsensus(inputAnswers)

  console.log(
    'CONSENSUS RESULTS',
    results
  )

  return results
}
