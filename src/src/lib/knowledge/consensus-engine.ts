export type ConsensusLevel =
  | 'none'
  | 'weak'
  | 'moderate'
  | 'strong'

export type ConsensusInputAnswer = {
  question_code: string
  question_type: string
  answer_text: string | null
  answer_json: Record<string, any> | null
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

function normalizeAnswer(answer: ConsensusInputAnswer): string {
  const json = answer.answer_json ?? {}

  if (answer.question_type === 'wine_aromatic_profile') {
    return JSON.stringify(json.aromatic_values ?? json)
  }

  if (answer.question_type === 'dish_intelligence') {
    return json.dish_name ?? answer.answer_text ?? ''
  }

  if (answer.question_type === 'international_identity') {
    return [json.primary_region_style, json.primary_grape]
      .filter(Boolean)
      .join(' | ')
  }

  if (
    answer.question_type === 'qualitative_relationship' ||
    answer.question_type === 'similar_profile' ||
    answer.question_type === 'relationship_profile'
  ) {
    return [json.similar_profile_code, json.similarity_degree]
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

function getConsensusLevel(
  totalResponses: number,
  agreementPercent: number
): ConsensusLevel {
  if (totalResponses >= 3 && agreementPercent >= 80) return 'strong'
  if (totalResponses >= 3 && agreementPercent >= 60) return 'moderate'
  if (totalResponses >= 1 && agreementPercent >= 40) return 'weak'
  return 'none'
}

export function calculateConsensus(
  answers: ConsensusInputAnswer[]
): QuestionConsensusResult[] {
  const grouped = new Map<string, ConsensusInputAnswer[]>()

  for (const answer of answers) {
    const key = `${answer.question_code}::${answer.question_type}`
    grouped.set(key, [...(grouped.get(key) ?? []), answer])
  }

  return Array.from(grouped.entries())
    .map(([key, group]) => {
      const [questionCode, questionType] = key.split('::')

      const normalized = group
        .map((answer) => ({
          value: normalizeAnswer(answer),
          confidence: answer.confidence ?? 1,
        }))
        .filter((answer) => answer.value)

      const counts = new Map<string, number>()

      for (const answer of normalized) {
        counts.set(answer.value, (counts.get(answer.value) ?? 0) + 1)
      }

      const sorted = Array.from(counts.entries()).sort(
        (a, b) => b[1] - a[1]
      )

      const [topAnswer = '', topAnswerVotes = 0] = sorted[0] ?? []

      const totalResponses = normalized.length

      const agreementPercent =
        totalResponses > 0
          ? Math.round((topAnswerVotes / totalResponses) * 100)
          : 0

      const averageConfidence =
        totalResponses > 0
          ? Math.round(
              normalized.reduce(
                (sum, answer) => sum + answer.confidence,
                0
              ) / totalResponses
            )
          : 0

      const confidenceScore = Math.round(
        agreementPercent *
          Math.min(totalResponses / 10, 1) *
          (averageConfidence / 5)
      )

      return {
        questionCode,
        questionType,
        totalResponses,
        topAnswer,
        topAnswerVotes,
        agreementPercent,
        averageConfidence,
        confidenceScore,
        consensusLevel: getConsensusLevel(
          totalResponses,
          agreementPercent
        ),
      }
    })
    .filter((item) => item.totalResponses > 0)
    .sort(
      (a, b) =>
        b.confidenceScore - a.confidenceScore ||
        b.agreementPercent - a.agreementPercent ||
        b.totalResponses - a.totalResponses
    )
}
