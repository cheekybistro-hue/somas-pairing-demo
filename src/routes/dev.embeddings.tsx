import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { runEmbeddingPreparationJob } from '../lib/knowledge/embedding-job'
import { loadKnowledgeEmbeddings } from '../lib/knowledge/embedding-persistence'
import { runEmbeddingGenerationJob } from '../lib/knowledge/embedding-generator'

export const Route = createFileRoute('/dev/embeddings')({
  component: DevEmbeddingsPage,
})


function DevEmbeddingsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [embeddings, setEmbeddings] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

async function generateEmbeddings() {
  try {
    setLoading(true)
    setError(null)

    const generationResult = await runEmbeddingGenerationJob()

    setResult(generationResult)

    const data = await loadKnowledgeEmbeddings()

    setEmbeddings(data)
  } catch (err: any) {
    setError(
      err.message ??
        'Erro ao gerar embeddings'
    )
  } finally {
    setLoading(false)
  }
}
  
  async function runJob() {
    try {
      setLoading(true)
      setError(null)

      const jobResult =
        await runEmbeddingPreparationJob()

      setResult(jobResult)

      const data =
        await loadKnowledgeEmbeddings()

      setEmbeddings(data)
    } catch (err: any) {
      setError(
        err.message ??
          'Erro ao executar embedding job'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <header>
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-2">
            SomAS Development
          </p>

          <h1 className="text-4xl font-light">
            Embedding Pipeline
          </h1>

          <p className="text-zinc-400 mt-3">
            Preparação de embeddings para conhecimento consolidado.
          </p>
        </header>

        <button
          type="button"
          onClick={runJob}
          disabled={loading}
          className="px-5 py-3 rounded-xl border border-amber-400 text-amber-400 hover:bg-amber-400/10"
        >
          {loading
            ? 'Running...'
            : 'Run Embedding Preparation Job'}
        </button>
<button
  type="button"
  onClick={generateEmbeddings}
  disabled={loading}
  className="px-5 py-3 rounded-xl border border-violet-400 text-violet-400 hover:bg-violet-400/10"
>
  {loading ? 'Running...' : 'Generate Embeddings'}
</button>
        {error && (
          <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-300">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
            <h2 className="text-xl mb-4">
              Job Result
            </h2>

            <div>
              Consensus Items:{' '}
              <strong>
                {result.consensusItems}
              </strong>
            </div>

            <div>
              Requests:{' '}
              <strong>
                {result.embeddingRequests}
              </strong>
            </div>

            <div>
              Pending Embeddings:{' '}
              <strong>
                {result.pendingEmbeddings}
              </strong>
            </div>
          </div>
        )}

        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
          <h2 className="text-xl mb-4">
            Knowledge Embeddings
          </h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left p-3">
                    ID
                  </th>

                  <th className="text-left p-3">
                    Source
                  </th>

                  <th className="text-left p-3">
                    Source ID
                  </th>

                  <th className="text-left p-3">
                    Status
                  </th>

                  <th className="text-left p-3">
                    Model
                  </th>
                </tr>
              </thead>

              <tbody>
                {embeddings.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-800"
                  >
                    <td className="p-3 font-mono text-xs">
                      {item.id}
                    </td>

                    <td className="p-3">
                      {item.source}
                    </td>

                    <td className="p-3">
                      {item.source_id}
                    </td>

                    <td className="p-3">
                      {item.status}
                    </td>

                    <td className="p-3">
                      {item.embedding_model}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {embeddings.length === 0 && (
              <div className="text-zinc-500 py-12 text-center">
                Nenhum embedding encontrado.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
