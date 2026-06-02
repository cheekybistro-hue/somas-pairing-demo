import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { loadConsensusSnapshot } from '../lib/knowledge/consensus-persistence'
import {
  buildTrainingDatasetJson,
  buildTrainingDatasetJsonl,
} from '../lib/knowledge/training-dataset'

export const Route = createFileRoute('/admin/knowledge')({
  component: AdminKnowledgeDashboard,
})

function AdminKnowledgeDashboard() {
  const [consensus, setConsensus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)

      const data = await loadConsensusSnapshot()

      setConsensus(data)
    } catch (err: any) {
      setError(err.message ?? 'Erro ao carregar conhecimento')
    } finally {
      setLoading(false)
    }
  }

  const filteredConsensus = useMemo(() => {
    const value = filter.trim().toLowerCase()

    if (!value) {
      return consensus
    }

    return consensus.filter((item) =>
      [
        item.question_code,
        item.question_type,
        item.winning_answer,
      ]
        .filter(Boolean)
        .some((field) =>
          String(field).toLowerCase().includes(value)
        )
    )
  }, [consensus, filter])

  const stats = useMemo(() => {
    const total = consensus.length

    const strong = consensus.filter(
      (item) => Number(item.confidence_score) >= 0.75
    ).length

    const medium = consensus.filter(
      (item) =>
        Number(item.confidence_score) >= 0.5 &&
        Number(item.confidence_score) < 0.75
    ).length

    const weak = consensus.filter(
      (item) => Number(item.confidence_score) < 0.5
    ).length

    const avgConfidence =
      total > 0
        ? consensus.reduce(
            (sum, item) =>
              sum + Number(item.confidence_score ?? 0),
            0
          ) / total
        : 0

    return {
      total,
      strong,
      medium,
      weak,
      avgConfidence,
    }
  }, [consensus])

  function exportJson() {
    const blob = new Blob(
      [JSON.stringify(filteredConsensus, null, 2)],
      { type: 'application/json' }
    )

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'knowledge-consensus.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  function exportCsv() {
    const headers = [
      'question_code',
      'question_type',
      'winning_answer',
      'votes',
      'total_votes',
      'confidence_score',
      'updated_at',
    ]

    const escapeCsvValue = (value: any) =>
      `"${String(value ?? '').replaceAll('"', '""')}"`

    const rows = filteredConsensus.map((item) =>
      [
        item.question_code,
        item.question_type,
        item.winning_answer,
        item.votes,
        item.total_votes,
        item.confidence_score,
        item.updated_at,
      ]
        .map(escapeCsvValue)
        .join(',')
    )

    const csv = [headers.join(','), ...rows].join('\n')

    const blob = new Blob(
      [csv],
      { type: 'text/csv;charset=utf-8;' }
    )

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'knowledge-consensus.csv'
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-2">
            SomAS Admin
          </p>

          <h1 className="text-4xl font-light">
            Knowledge Dashboard
          </h1>

          <p className="text-zinc-400 mt-3 max-w-3xl">
            Visão consolidada do conhecimento gerado a partir das respostas dos especialistas.
            Este painel mostra consensos calculados e guardados em knowledge_consensus.
          </p>
        </header>

        {error && (
          <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-300">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard
            label="Consensos"
            value={stats.total}
            helper="Total gerado"
          />

          <StatCard
            label="Confiança média"
            value={`${Math.round(stats.avgConfidence * 100)}%`}
            helper="Score agregado"
          />

          <StatCard
            label="Forte"
            value={stats.strong}
            helper="≥ 75%"
          />

          <StatCard
            label="Médio"
            value={stats.medium}
            helper="50% - 74%"
          />

          <StatCard
            label="Fraco"
            value={stats.weak}
            helper="< 50%"
          />
        </section>

        <section className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-light">
                Knowledge Consensus
              </h2>

              <p className="text-zinc-500 text-sm mt-1">
                {filteredConsensus.length} de {consensus.length} registos
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Filtrar por questão, tipo ou resposta..."
                className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 text-sm min-w-[320px]"
              />

              <button
                type="button"
                onClick={exportCsv}
                className="px-4 py-2 rounded-xl border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 text-sm"
              >
                Export CSV
              </button>

              <button
                type="button"
                onClick={exportJson}
                className="px-4 py-2 rounded-xl border border-sky-500 text-sky-400 hover:bg-sky-500/10 text-sm"
              >
                Export JSON
              </button>

              <button
                type="button"
                onClick={loadData}
                className="px-4 py-2 rounded-xl border border-amber-400 text-amber-400 hover:bg-amber-400/10 text-sm"
              >
                Atualizar
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-zinc-400 py-12">
              A carregar conhecimento...
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-zinc-400">
                    <th className="text-left p-3">
                      Questão
                    </th>
                    <th className="text-left p-3">
                      Tipo
                    </th>
                    <th className="text-left p-3">
                      Resposta vencedora
                    </th>
                    <th className="text-left p-3">
                      Votos
                    </th>
                    <th className="text-left p-3">
                      Total
                    </th>
                    <th className="text-left p-3">
                      Confiança
                    </th>
                    <th className="text-left p-3">
                      Atualizado
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredConsensus.map((item) => (
                    <tr
                      key={`${item.question_code}-${item.question_type}`}
                      className="border-b border-zinc-800 hover:bg-zinc-900/60"
                    >
                      <td className="p-3 font-mono text-amber-400">
                        {item.question_code}
                      </td>

                      <td className="p-3 text-zinc-300">
                        {item.question_type}
                      </td>

                      <td className="p-3 font-semibold">
                        {item.winning_answer}
                      </td>

                      <td className="p-3">
                        {item.votes}
                      </td>

                      <td className="p-3">
                        {item.total_votes}
                      </td>

                      <td className="p-3">
                        <ConfidenceBadge
                          value={Number(item.confidence_score ?? 0)}
                        />
                      </td>

                      <td className="p-3 text-zinc-500">
                        {item.updated_at
                          ? new Date(item.updated_at).toLocaleString('pt-PT')
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredConsensus.length === 0 && (
                <div className="text-zinc-500 py-12 text-center">
                  Nenhum consenso encontrado.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  helper,
}: {
  label: string
  value: string | number
  helper: string
}) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5">
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
        {label}
      </div>

      <div className="text-2xl font-semibold">
        {value}
      </div>

      <div className="text-sm text-zinc-500 mt-1">
        {helper}
      </div>
    </div>
  )
}

function ConfidenceBadge({ value }: { value: number }) {
  const label = `${Math.round(value * 100)}%`

  const className =
    value >= 0.75
      ? 'border-emerald-700 bg-emerald-950/40 text-emerald-300'
      : value >= 0.5
        ? 'border-amber-700 bg-amber-950/40 text-amber-300'
        : 'border-red-800 bg-red-950/40 text-red-300'

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${className}`}>
      {label}
    </span>
  )
}
