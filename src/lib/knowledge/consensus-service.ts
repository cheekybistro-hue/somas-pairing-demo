export type ConsensusLevel =
  | 'none'
  | 'weak'
  | 'moderate'
  | 'strong'

export type ConsensusInputAnswer = {
  question_code: string
  question_type: string
  answer_text: string | null
  answer_json: any
  confidence: number | null
}

export type QuestionConsensusResult = {
  questionCode: string
  questionType: string
  totalResponses: number
  topAnswer: string
  topAnswerVotes: number
  agreementPercent: number
  averageConfidence: number
  confidenceScore: number
  consensusLevel: ConsensusLevel
}

export function normalizeConsensusAnswer(
  answer: ConsensusInputAnswer
): string {
  const json = answer.answer_json ?? {}

  if (answer.question_type === 'wine_aromatic_profile') {
    return JSON.stringify(json.aromatic_values ?? json)
  }

  if (answer.question_type === 'dish_intelligence') {
    return json.dish_name ?? answer.answer_text ?? ''
  }

  if (answer.question_type === 'international_identity') {
    return [
      json.primary_region_style,
      json.primary_grape,
    ]
      .filter(Boolean)
      .join(' | ')
  }

  if (
    answer.question_type === 'qualitative_relationship' ||
    answer.question_type === 'similar_profile' ||
    answer.question_type === 'relationship_profile'
  ) {
    return [
      json.similar_profile_code,
      json.similarity_degree,
    ]
      .filter(Boolean)
      .join(' | ')
  }

  return (
    answer.answer_text ??
    json.value ??
    json.wine_profile_code ??
    ''
  )
}

export function calculateQuestionConsensus(
  answers: ConsensusInputAnswer[]
): QuestionConsensusResult {
  const validAnswers = answers
    .map((answer) => ({
      ...answer,
      normalized: normalizeConsensusAnswer(answer),
    }))
    .filter((answer) => answer.normalized)

  const counts = new Map<string, number>()

  for (const answer of validAnswers) {
    counts.set(
      answer.normalized,
      (counts.get(answer.normalized) ?? 0) + 1
    )
  }

  let topAnswer = ''
  let topAnswerVotes = 0

  for (const [answer, votes] of counts) {
    if (votes > topAnswerVotes) {
      topAnswer = answer
      topAnswerVotes = votes
    }
  }

  const totalResponses = validAnswers.length

  const agreementPercent =
    totalResponses > 0
      ? Math.round((topAnswerVotes / totalResponses) * 100)
      : 0

  const confidenceValues = validAnswers
    .map((answer) => answer.confidence ?? 0)
    .filter((value) => value > 0)

  const averageConfidence =
    confidenceValues.length > 0
      ? Math.round(
          (confidenceValues.reduce((sum, value) => sum + value, 0) /
            confidenceValues.length) *
            100
        )
      : 0

  const confidenceScore = Math.round(
    agreementPercent *
      Math.min(totalResponses / 10, 1) *
      (averageConfidence / 100)
  )

  let consensusLevel: ConsensusLevel = 'none'

  if (totalResponses >= 3 && agreementPercent >= 80) {
    consensusLevel = 'strong'
  } else if (totalResponses >= 3 && agreementPercent >= 60) {
    consensusLevel = 'moderate'
  } else if (totalResponses >= 2 && agreementPercent >= 40) {
    consensusLevel = 'weak'
  }

  return {
    questionCode: answers[0]?.question_code ?? '',
    questionType: answers[0]?.question_type ?? 'unknown',
    totalResponses,
    topAnswer,
    topAnswerVotes,
    agreementPercent,
    averageConfidence,
    confidenceScore,
    consensusLevel,
  }
}

export function calculateConsensus(
  answers: ConsensusInputAnswer[]
): QuestionConsensusResult[] {
  const grouped = new Map<string, ConsensusInputAnswer[]>()

  for (const answer of answers) {
    if (!grouped.has(answer.question_code)) {
      grouped.set(answer.question_code, [])
    }

    grouped.get(answer.question_code)!.push(answer)
  }

  return Array.from(grouped.values())
    .map(calculateQuestionConsensus)
    .sort((a, b) => b.confidenceScore - a.confidenceScore)
}
