import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { searchKnowledge } from '../lib/knowledge/vector-search'

export const Route = createFileRoute('/dev/answer')({
  component: DevAnswerPage,
})

function DevAnswerPage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generateAnswer() {
    if (!question.trim()) {
      setError('Escreve uma pergunta.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const results = await searchKnowledge(
        question,
        5
      )

      setSources(results)

      const generatedAnswer =
        results.length === 0
          ? 'Não encontrei conhecimento relevante.'
          : [
              'Resposta baseada no conhecimento disponível:',
              '',
              ...results.map(
                (item) => `• ${item.content}`
              ),
            ].join('\n')

      setAnswer(generatedAnswer)
    } catch (err: any) {
      setError(
        err.message ??
          'Erro ao gerar resposta.'
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
            Knowledge Assistant
          </h1>

          <p className="text-zinc-400 mt-3">
            Primeiro assistente baseado em RAG.
          </p>
        </header>

        <section className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 space-y-4">
          <textarea
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            placeholder="Ex: Que vinhos são semelhantes ao perfil W01?"
            className="w-full min-h-[120px] bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-sm"
          />

          <button
            type="button"
            onClick={generateAnswer}
            disabled={loading}
            className="px-5 py-3 rounded-xl border border-amber-400 text-amber-400 hover:bg-amber-400/10"
          >
            {loading
              ? 'Thinking...'
              : 'Generate Answer'}
          </button>

          {error && (
            <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-300">
              {error}
            </div>
          )}
        </section>

        {answer && (
          <section className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Answer
            </h2>

            <pre className="whitespace-pre-wrap text-zinc-300">
              {answer}
            </pre>
          </section>
        )}

        {sources.length > 0 && (
          <section className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Sources
            </h2>

            <div className="space-y-3">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="border border-zinc-700 rounded-xl p-4"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-xs text-amber-400">
                      {source.sourceId}
                    </span>

                    <span>
                      {source.score.toFixed(3)}
                    </span>
                  </div>

                  <div className="text-zinc-300">
                    {source.content}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
