import { supabase } from '@/lib/supabase'

import { createEmbeddingProvider } from './embedding-provider'
import { loadKnowledgeEmbeddings } from './embedding-persistence'

export async function runEmbeddingGenerationJob() {
  const provider = createEmbeddingProvider('mock')

  const embeddings = await loadKnowledgeEmbeddings()

  const pending = embeddings.filter(
    (item) => item.status === 'pending'
  )

  let processed = 0

  for (const item of pending) {
    const result = await provider.generateEmbedding({
      content: item.content,
    })

    const { error } = await supabase
      .from('knowledge_embeddings')
      .update({
        embedding: result.embedding,
        embedding_model: result.model,
        dimensions: result.dimensions,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id)

    if (error) {
      throw new Error(error.message)
    }

    processed++
  }

  return {
    total: embeddings.length,
    pending: pending.length,
    processed,
  }
}
