import type {
  EmbeddingDocument,
} from './embedding-pipeline'

export type KnowledgeChunk = {
  id: string
  documentId: string
  content: string
  sequence: number
}

export function buildKnowledgeChunks(
  documents: EmbeddingDocument[]
): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = []

  for (const document of documents) {
    const paragraphs =
      document.content
        .split('\n')
        .filter(Boolean)

    paragraphs.forEach(
      (paragraph, index) => {
        chunks.push({
          id: `${document.id}-${index}`,
          documentId: document.id,
          content: paragraph,
          sequence: index,
        })
      }
    )
  }

  return chunks
}
