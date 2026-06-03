import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { loadConsensusSnapshot } from '../lib/knowledge/consensus-persistence'
import { buildRagDocuments } from '../lib/knowledge/rag-documents'

export const Route = createFileRoute('/dev/rag')({
  component: DevRagDocumentsPage,
})

function DevRagDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadDocuments() {
    try {
      setLoading(true)
      setError(null)

      const consensus = await loadConsensusSnapshot()
      const docs = buildRagDocuments(consensus)

      setDocuments(docs)
    } catch (err: any) {
      setError(
        err.message ??
          'Erro ao carregar documentos RAG'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-2">
            SomAS Development
          </p>

          <h1 className="text-4xl font-light">
            RAG Documents
          </h1>

          <p className="text-zinc-400 mt-3">
            Documentos textuais gerados a partir do consenso para alimentar embeddings e pesquisa semântica.
          </p>
        </header>

        <button
          type="button"
          onClick={loadDocuments}
          disabled={loading}
          className="px-5 py-3 rounded-xl border border-amber-400 text-amber-400 hover:bg-amber-400/10"
        >
          {loading ? 'Loading...' : 'Load RAG Documents'}
        </button>

        {error && (
          <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-300">
            {error}
          </div>
        )}

        <section className="space-y-4">
          {documents.map((document) => (
            <div
              key={document.id}
              className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5"
            >
              <div className="flex justify-between gap-4 mb-3">
                <div>
                  <div className="text-xs uppercase tracking-widest text-zinc-500">
                    {document.metadata.source}
                  </div>

                  <h2 className="text-lg font-semibold text-amber-400 mt-1">
                    {document.title}
                  </h2>
                </div>

                <div className="text-right text-sm text-zinc-400">
                  <div>
                    Confidence:{' '}
                    <strong>
                      {Math.round(document.metadata.confidenceScore * 100)}%
                    </strong>
                  </div>

                  <div>
                    Votes:{' '}
                    <strong>
                      {document.metadata.votes}/{document.metadata.totalVotes}
                    </strong>
                  </div>
                </div>
              </div>

              <p className="text-zinc-300 leading-relaxed">
                {document.content}
              </p>

              <div className="mt-4 text-xs text-zinc-500 font-mono">
                {document.id}
              </div>
            </div>
          ))}

          {documents.length === 0 && !loading && (
            <div className="text-zinc-500 text-center py-12">
              Nenhum documento carregado.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
