import type {
  KnowledgeEmbeddingRequest,
  KnowledgeEmbeddingRecord,
} from './embedding-types'

import { createPendingEmbedding } from './embedding-types'
import { buildRagDocuments } from './rag-documents'

export function buildConsensusEmbeddingRequests(
  consensus: any[]
): KnowledgeEmbeddingRequest[] {
  const documents = buildRagDocuments(consensus)

  return documents.map((document) => ({
    source: 'expert_consensus',
    sourceId: document.id,
    content: document.content,
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
  return Math.ceil(content.length / 4)
}

export function estimateEmbeddingCost(
  requests: KnowledgeEmbeddingRequest[]
) {
  return requests.reduce(
    (sum, request) =>
      sum + estimateEmbeddingTokens(request.content),
    0
  )
}
