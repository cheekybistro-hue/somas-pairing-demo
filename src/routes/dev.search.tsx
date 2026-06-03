import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { searchKnowledge } from '../lib/knowledge/vector-search'

export const Route = createFileRoute('/dev/search')({
  component: DevSearchPage,
})

function DevSearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch() {
    if (!query.trim()) {
      setError('Escreve uma pergunta ou termo de pesquisa.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data = await searchKnowledge(query.trim(), 5)

      setResults(data)
    } catch (err: any) {
      setError(err.message ?? 'Erro ao pesquisar conhecimento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-2">
            SomAS Development
          </p>

          <h1 className="text-4xl font-light">
            Knowledge Semantic Search
          </h1>

          <p className="text-zinc-400 mt-3">
            Pesquisa semântica sobre conhecimento consolidado.
          </p>
        </header>

        <section className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 space-y-4">
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ex: que vinho combina com pratos frescos e minerais?"
            className="w-full min-h-[120px] bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-sm"
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="px-5 py-3 rounded-xl border border-amber-400 text-amber-400 hover:bg-amber-400/10"
          >
            {loading ? 'Searching...' : 'Search Knowledge'}
          </button>

          {error && (
            <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-300">
              {error}
            </div>
          )}
        </section>

        <section className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5"
            >
              <div className="flex justify-between gap-4 mb-3">
                <div>
                  <div className="text-xs uppercase tracking-widest text-zinc-500">
                    {result.source}
                  </div>

                  <div className="font-mono text-amber-400 text-sm mt-1">
                    {result.sourceId}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-zinc-500">
                    Score
                  </div>

                  <div className="text-lg font-semibold">
                    {Number(result.score).toFixed(3)}
                  </div>
                </div>
              </div>

              <div className="text-zinc-300">
                {result.content}
              </div>
            </div>
          ))}

          {results.length === 0 && !loading && (
            <div className="text-zinc-500 text-center py-12">
              Nenhum resultado ainda.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
