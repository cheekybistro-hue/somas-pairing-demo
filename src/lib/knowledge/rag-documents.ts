export type KnowledgeRagDocument = {
  id: string
  title: string
  content: string
  metadata: {
    questionCode: string
    questionType: string
    source: 'expert_consensus'
    confidenceScore: number
    votes: number
    totalVotes: number
  }
}

function getSourceProfile(
  questionCode: string
) {
  return questionCode.split('_')[0]
}

function buildTitle(item: any) {
  return `${item.question_code} · ${item.question_type}`
}

function buildContent(item: any) {
  const questionCode = item.question_code
  const questionType = item.question_type
  const winningAnswer = item.winning_answer
  const sourceProfile = getSourceProfile(questionCode)

  if (questionType === 'national_region') {
    return `Wine profile ${sourceProfile} is associated with the Portuguese region ${winningAnswer}.`
  }

  if (questionType === 'international_identity') {
    return `Wine profile ${sourceProfile} has an international identity similar to ${winningAnswer}.`
  }

  if (questionType === 'qualitative_relationship') {
    return `Wine profile ${sourceProfile} has a qualitative relationship with ${winningAnswer}.`
  }

  if (questionType === 'pairing_choice') {
    return `Food archetype ${sourceProfile} pairs with wine profile ${winningAnswer}.`
  }

  return `${questionCode} ${questionType} ${winningAnswer}`
}

export function buildRagDocuments(
  consensus: any[]
): KnowledgeRagDocument[] {
  return consensus.map((item) => ({
    id: `${item.question_code}:${item.question_type}`,
    title: buildTitle(item),
    content: buildContent(item),
    metadata: {
      questionCode: item.question_code,
      questionType: item.question_type,
      source: 'expert_consensus',
      confidenceScore: Number(item.confidence_score ?? 0),
      votes: Number(item.votes ?? 0),
      totalVotes: Number(item.total_votes ?? 0),
    },
  }))
}
