import type {
  ConsensusDocument,
} from './consensus-documents'

export type EmbeddingDocument = {
  id: string
  source: 'consensus'
  content: string
  metadata: Record<string, unknown>
}

export function buildEmbeddingDocuments(
  consensusDocuments: ConsensusDocument[]
): EmbeddingDocument[] {
  return consensusDocuments.map((document) => ({
    id: document.id,
    source: 'consensus',
    content: [
      document.title,
      '',
      document.content,
    ].join('\n'),
    metadata: {
      ...document.metadata,
      questionCode: document.questionCode,
    },
  }))
}
