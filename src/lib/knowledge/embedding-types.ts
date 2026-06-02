export type KnowledgeEmbeddingSource =
  | 'expert_consensus'
  | 'knowledge_answer'
  | 'training_dataset'

export type KnowledgeEmbeddingStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'

export type KnowledgeEmbeddingRecord = {
  id: string

  source: KnowledgeEmbeddingSource

  sourceId: string

  content: string

  contentHash: string

  embeddingModel: string

  dimensions: number

  embedding?: number[]

  status: KnowledgeEmbeddingStatus

  createdAt?: string

  updatedAt?: string
}

export type KnowledgeEmbeddingRequest = {
  source: KnowledgeEmbeddingSource

  sourceId: string

  content: string
}

export type KnowledgeEmbeddingResult = {
  sourceId: string

  embedding: number[]

  dimensions: number

  embeddingModel: string
}

export function buildEmbeddingContent(
  item: {
    question_code: string
    question_type: string
    winning_answer: string
  }
) {
  return [
    item.question_code,
    item.question_type,
    item.winning_answer,
  ]
    .filter(Boolean)
    .join(' | ')
}

export function buildEmbeddingId(
  source: KnowledgeEmbeddingSource,
  sourceId: string
) {
  return `${source}:${sourceId}`
}

export function createPendingEmbedding(
  source: KnowledgeEmbeddingSource,
  sourceId: string,
  content: string
): KnowledgeEmbeddingRecord {
  return {
    id: buildEmbeddingId(
      source,
      sourceId
    ),

    source,

    sourceId,

    content,

    contentHash: content,

    embeddingModel: 'pending',

    dimensions: 0,

    status: 'pending',
  }
}
