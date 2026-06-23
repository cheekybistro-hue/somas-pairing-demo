import type { ConsensusDocument } from '@/lib/knowledge/consensus-documents'

type Props = {
  documents: ConsensusDocument[]
}

export function ConsensusDocumentsCard({
  documents,
}: Props) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8">
      <p className="text-xs uppercase tracking-widest text-amber-400">
        Documents
      </p>

      <h3 className="text-2xl font-semibold mt-2">
        Consensus Documents
      </h3>

      <p className="text-zinc-400 mt-2">
        Documentos preparados para embeddings e pesquisa semântica.
      </p>

      <div className="mt-6 space-y-4">
        {documents.slice(0, 5).map((document) => (
          <div
            key={document.id}
            className="border border-zinc-700 rounded-xl p-4"
          >
            <div className="font-medium">
              {document.questionCode}
            </div>

            <div className="text-sm text-zinc-400 mt-1">
              {document.metadata.consensusLevel}
            </div>

            <pre className="mt-3 text-xs whitespace-pre-wrap text-zinc-300">
              {document.content}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
