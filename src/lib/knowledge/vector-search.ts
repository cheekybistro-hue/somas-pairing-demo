import { createEmbeddingProvider } from './embedding-provider'
import { loadKnowledgeEmbeddings } from './embedding-persistence'

type SearchResult = {
  id: string
  source: string
  sourceId: string
  content: string
  score: number
}

function cosineSimilarity(
  a: number[],
  b: number[]
) {
  if (a.length === 0 || b.length === 0) {
    return 0
  }

  const length = Math.min(a.length, b.length)

  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export async function searchKnowledge(
  query: string,
  limit = 5
): Promise<SearchResult[]> {
  const provider = createEmbeddingProvider('mock')

  const queryEmbedding =
    await provider.generateEmbedding({
      content: query,
    })

  const embeddings =
    await loadKnowledgeEmbeddings()

  return embeddings
    .filter(
  (item) =>
    item.status === 'completed' &&
    item.embedding
)
    .map((item) => ({
      id: item.id,
      source: item.source,
      sourceId: item.source_id,
      content: item.content,
score: cosineSimilarity(
  queryEmbedding.embedding,
  Array.isArray(item.embedding)
    ? item.embedding
    : JSON.parse(item.embedding)
),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
