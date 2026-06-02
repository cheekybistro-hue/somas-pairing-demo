export type KnowledgeTrainingRow = {
  id: string
  task: string
  input: string
  output: string
  confidence: number
  votes: number
  totalVotes: number
  source: 'expert_consensus'
  metadata: {
    questionCode: string
    questionType: string
    confidenceLevel: 'strong' | 'medium' | 'weak'
  }
}

function getConfidenceLevel(
  confidence: number
): 'strong' | 'medium' | 'weak' {
  if (confidence >= 0.75) {
    return 'strong'
  }

  if (confidence >= 0.5) {
    return 'medium'
  }

  return 'weak'
}

function buildInputLabel(item: any) {
  return `${item.question_code} (${item.question_type})`
}

export function buildTrainingDataset(
  consensus: any[]
): KnowledgeTrainingRow[] {
  return consensus.map((item) => {
    const confidence = Number(
      item.confidence_score ?? 0
    )

    return {
      id: `${item.question_code}:${item.question_type}`,
      task: 'wine_pairing_knowledge_consensus',
      input: buildInputLabel(item),
      output: item.winning_answer,
      confidence,
      votes: Number(item.votes ?? 0),
      totalVotes: Number(item.total_votes ?? 0),
      source: 'expert_consensus',
      metadata: {
        questionCode: item.question_code,
        questionType: item.question_type,
        confidenceLevel: getConfidenceLevel(confidence),
      },
    }
  })
}

export function buildTrainingDatasetJson(
  consensus: any[]
) {
  return JSON.stringify(
    buildTrainingDataset(consensus),
    null,
    2
  )
}

export function buildTrainingDatasetJsonl(
  consensus: any[]
) {
  return buildTrainingDataset(consensus)
    .map((row) => JSON.stringify(row))
    .join('\n')
}
