import { normalizeKnowledgeAnswers } from './answer-normalizer'
import { calculateConsensus } from './consensus-engine'
import { extractSemanticAnswer } from './answer-semantics'
export function buildKnowledgeConsensus(
  answers: any[]
) {
  const normalized =
    normalizeKnowledgeAnswers(answers)

  const validAnswers = normalized.filter(
    (answer) =>
      answer.questionType !== 'unknown'
  )

  return calculateConsensus(
    validAnswers.map((answer) => ({
      question_code: answer.questionCode,
      question_type: answer.questionType,
   answer_text:
      answer.rawAnswerText ??
      answer.wineProfileCode ??
      answer.foodArchetypeCode ??
     'unknown',
      answer_json: null,
      confidence: answer.confidence,
    }))
  )
}
