import {
  KnowledgeEmbeddingRequest,
  KnowledgeEmbeddingRecord,
  createPendingEmbedding,
} from './embedding-types'

export function buildConsensusEmbeddingRequests(
  consensus: any[]
): KnowledgeEmbeddingRequest[] {
  return consensus.map((item) => ({
    source: 'expert_consensus',

    sourceId: `${item.question_code}:${item.question_type}`,

    content: [
      item.question_code,
      item.question_type,
      item.winning_answer,
    ]
      .filter(Boolean)
      .join(' | '),
  }))
}

export function createPendingEmbeddings(
  requests: KnowledgeEmbeddingRequest[]
): KnowledgeEmbeddingRecord[] {
  return requests.map((request) =>
    createPendingEmbedding(
      request.source,
      request.sourceId,
      request.content
    )
  )
}

export function estimateEmbeddingTokens(
  content: string
) {
  return Math.ceil(
    content.length / 4
  )
}

export function estimateEmbeddingCost(
  requests: KnowledgeEmbeddingRequest[]
) {
  return requests.reduce(
    (sum, request) =>
      sum +
      estimateEmbeddingTokens(
        request.content
      ),
    0
  )
}
