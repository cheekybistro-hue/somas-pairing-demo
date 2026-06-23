import type { KnowledgeChunk } from '@/lib/knowledge/chunking-pipeline'

type Props = {
  chunks: KnowledgeChunk[]
}

export function KnowledgeChunksCard({ chunks }: Props) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8">
      <p className="text-xs uppercase tracking-widest text-amber-400">
        Chunks
      </p>

      <h3 className="text-2xl font-semibold mt-2">
        Knowledge Chunks
      </h3>

      <p className="text-zinc-400 mt-2">
        Fragmentos preparados para geração de embeddings.
      </p>

      <div className="mt-6 text-sm text-zinc-400">
        {chunks.length} chunk(s) preparados.
      </div>

      <div className="mt-6 space-y-4">
        {chunks.slice(0, 5).map((chunk) => (
          <div
            key={chunk.id}
            className="border border-zinc-700 rounded-xl p-4"
          >
            <div className="text-sm text-amber-400">
              {chunk.id}
            </div>

            <div className="text-xs text-zinc-500 mt-1">
              Documento: {chunk.documentId} · Sequência {chunk.sequence}
            </div>

            <pre className="mt-3 text-xs whitespace-pre-wrap text-zinc-300">
              {chunk.content}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
