import { supabase } from '@/lib/supabase'

import type {
  KnowledgeEmbeddingRecord,
  KnowledgeEmbeddingStatus,
} from './embedding-types'

export async function loadKnowledgeEmbeddings() {
  const { data, error } = await supabase
    .from('knowledge_embeddings')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function savePendingEmbeddings(
  embeddings: KnowledgeEmbeddingRecord[]
) {
  if (embeddings.length === 0) {
    return
  }

  const { error } = await supabase
    .from('knowledge_embeddings')
    .upsert(
      embeddings.map((item) => ({
        id: item.id,
        source: item.source,
        source_id: item.sourceId,
        content: item.content,
        content_hash: item.contentHash,
        embedding_model: item.embeddingModel,
        dimensions: item.dimensions,
        embedding: item.embedding ?? null,
        status: item.status,
        updated_at: new Date().toISOString(),
      })),
      {
        onConflict: 'id',
      }
    )

  if (error) {
    throw new Error(error.message)
  }
}

export async function updateEmbeddingStatus(
  id: string,
  status: KnowledgeEmbeddingStatus
) {
  const { error } = await supabase
    .from('knowledge_embeddings')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}
