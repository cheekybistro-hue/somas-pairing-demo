import type {
  QuestionConsensusResult,
} from './consensus-engine'

export type ConsensusDocument = {
  id: string
  questionCode: string
  title: string
  content: string
  metadata: {
    questionType: string
    totalResponses: number
    agreementPercent: number
    confidenceScore: number
    consensusLevel: string
  }
}

export function buildConsensusDocuments(
  results: QuestionConsensusResult[]
): ConsensusDocument[] {
  return results.map((result) => {
    const title =
      `Consensus for ${result.questionCode}`

    const content = [
      `Question code: ${result.questionCode}`,
      `Question type: ${result.questionType}`,
      `Consensus answer: ${result.topAnswer}`,
      `Agreement: ${result.agreementPercent}%`,
      `Responses: ${result.totalResponses}`,
      `Top answer votes: ${result.topAnswerVotes}`,
      `Average confidence: ${result.averageConfidence}`,
      `Confidence score: ${result.confidenceScore}`,
      `Consensus level: ${result.consensusLevel}`,
    ].join('\n')

    return {
      id: `consensus-${result.questionCode}`,
      questionCode: result.questionCode,
      title,
      content,
      metadata: {
        questionType: result.questionType,
        totalResponses: result.totalResponses,
        agreementPercent: result.agreementPercent,
        confidenceScore: result.confidenceScore,
        consensusLevel: result.consensusLevel,
      },
    }
  })
}
