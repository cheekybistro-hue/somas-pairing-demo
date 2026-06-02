export type NormalizedKnowledgeAnswer = {
  questionCode: string
  questionType?: string

  wineProfileCode?: string
  foodArchetypeCode?: string

  descriptors: string[]

  confidence: number

  reason?: string

  rawAnswerText?: string
}

export function normalizeKnowledgeAnswer(answer: any): NormalizedKnowledgeAnswer {
  const json = answer.answer_json ?? {}

  return {
    questionCode: answer.question_code,

    questionType:
      json.question_type ??
      answer.question_type ??
      undefined,

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

    confidence:
      Number(
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
  return answers.map(normalizeKnowledgeAnswer)
}
