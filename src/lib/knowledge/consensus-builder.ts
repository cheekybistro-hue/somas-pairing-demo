import { normalizeKnowledgeAnswers } from './answer-normalizer'
import { calculateConsensus } from './consensus-engine'

export function buildKnowledgeConsensus(
  answers: any[]
) {
  const normalized =
    normalizeKnowledgeAnswers(answers)

  return calculateConsensus(
    normalized.map((answer) => ({
      question_code: answer.questionCode,
      question_type:
        answer.questionType ?? 'unknown',
      answer_text:
        answer.wineProfileCode ??
        answer.rawAnswerText ??
        'unknown',
      answer_json: null,
      confidence: answer.confidence,
    }))
  )
}
