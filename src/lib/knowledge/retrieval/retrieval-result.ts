export type RetrievalEvidenceType =
  | 'semantic_chunk'
  | 'consensus'
  | 'graph_relation'
  | 'passport'
  | 'market_signal'

export interface RetrievalEvidence {
  id: string
  type: RetrievalEvidenceType
  chunkId?: string
  documentId?: string
  similarity?: number
  confidence?: number
  content: string
  source: string
  metadata: Record<string, unknown>
  retrievedAt: string
}
