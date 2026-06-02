export type NormalizedKnowledgeAnswer = {
  questionCode: string
  questionType: string

  wineProfileCode?: string
  foodArchetypeCode?: string

  descriptors: string[]

  confidence: number

  reason?: string

  rawAnswerText?: string
}

function inferQuestionType(answer: any, json: any): string {
  if (json.question_type) {
    return json.question_type
  }

  const code = answer.question_code ?? ''

  if (code.includes('_PAIRING')) {
    return 'pairing_choice'
  }

  if (code.includes('_INTERNATIONAL_IDENTITY')) {
    return 'international_identity'
  }

  if (code.includes('_NATIONAL_REGION')) {
    return 'national_region'
  }

  if (code.includes('_QUALITATIVE_RELATIONSHIP')) {
    return 'qualitative_relationship'
  }

  return 'unknown'
}

export function normalizeKnowledgeAnswer(
  answer: any
): NormalizedKnowledgeAnswer {
  const json = answer.answer_json ?? {}

  return {
    questionCode: answer.question_code,

    questionType: inferQuestionType(
      answer,
      json
    ),

    wineProfileCode:
      json.wine_profile_code ??
      undefined,

    foodArchetypeCode:
      json.food_archetype_code ??
      undefined,

    descriptors:
      Array.isArray(json.descriptors)
        ? json.descriptors
        : [],

    confidence: Number(
      json.confidence ??
      answer.confidence ??
      1
    ),

    reason:
      json.reason ??
      undefined,

    rawAnswerText:
      answer.answer_text ??
      undefined,
  }
}

export function normalizeKnowledgeAnswers(
  answers: any[]
): NormalizedKnowledgeAnswer[] {
  return answers.map(
    normalizeKnowledgeAnswer
  )
}
