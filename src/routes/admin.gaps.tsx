import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

import { loadConsensusSnapshot } from '../lib/knowledge/consensus-persistence'

export const Route = createFileRoute('/admin/gaps')({
  component: AdminKnowledgeGaps,
})

function AdminKnowledgeGaps() {
  const [consensus, setConsensus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      setError(err.message ?? 'Erro ao carregar gaps')
    } finally {
      setLoading(false)
    }
  }

  const gaps = useMemo(() => {
    return consensus
      .map((item) => {
        const confidence = Number(item.confidence_score ?? 0)
        const totalVotes = Number(item.total_votes ?? 0)
        const votes = Number(item.votes ?? 0)

        let severity: 'high' | 'medium' | 'low' = 'low'
        let reason = 'Consenso aceitável'

        if (totalVotes < 3) {
          severity = 'high'
          reason = 'Poucas respostas de especialistas'
        } else if (confidence < 0.5) {
          severity = 'high'
          reason = 'Baixa confiança no consenso'
        } else if (confidence < 0.75) {
          severity = 'medium'
          reason = 'Consenso moderado'
        } else if (votes < totalVotes) {
          severity = 'low'
          reason = 'Existe alguma divergência'
        }

        return {
          ...item,
          confidence,
          totalVotes,
          votes,
          severity,
          reason,
        }
      })
      .filter(
        (item) =>
          item.severity === 'high' ||
          item.severity === 'medium' ||
          item.votes < item.totalVotes
      )
      .sort((a, b) => {
        const severityRank = {
          high: 0,
          medium: 1,
          low: 2,
        }

        const severityDiff =
          severityRank[a.severity] - severityRank[b.severity]

        if (severityDiff !== 0) {
          return severityDiff
        }

        return a.confidence - b.confidence
      })
  }, [consensus])

  const stats = useMemo(() => {
    const high = gaps.filter((gap) => gap.severity === 'high').length
    const medium = gaps.filter((gap) => gap.severity === 'medium').length
    const low = gaps.filter((gap) => gap.severity === 'low').length

    return {
      total: gaps.length,
      high,
      medium,
      low,
    }
  }, [gaps])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-2">
            SomAS Admin
          </p>

          <h1 className="text-4xl font-light">
            Knowledge Gaps
          </h1>

          <p className="text-zinc-400 mt-3 max-w-3xl">
            Identifica áreas onde o conhecimento ainda é fraco, pouco respondido
            ou onde existe divergência entre especialistas.
          </p>
        </header>

        {error && (
          <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-300">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Gaps"
            value={stats.total}
            helper="Total identificados"
          />

          <StatCard
            label="Críticos"
            value={stats.high}
            helper="Baixa cobertura/confiança"
          />

          <StatCard
            label="Médios"
            value={stats.medium}
            helper="Consenso moderado"
          />

          <StatCard
            label="Leves"
            value={stats.low}
            helper="Alguma divergência"
          />
        </section>

        <section className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light">
                Gap Analysis
              </h2>

              <p className="text-zinc-500 text-sm mt-1">
                {gaps.length} registos precisam de atenção
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
              className="px-4 py-2 rounded-xl border border-amber-400 text-amber-400 hover:bg-amber-400/10 text-sm"
            >
              Atualizar
            </button>
          </div>

          {loading ? (
            <div className="text-zinc-400 py-12">
              A carregar gaps...
            </div>
          ) : gaps.length === 0 ? (
            <div className="text-zinc-500 py-12 text-center">
              Nenhum gap encontrado.
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-zinc-400">
                    <th className="text-left p-3">
                      Severidade
                    </th>
                    <th className="text-left p-3">
                      Questão
                    </th>
                    <th className="text-left p-3">
                      Tipo
                    </th>
                    <th className="text-left p-3">
                      Resposta atual
                    </th>
                    <th className="text-left p-3">
                      Votos
                    </th>
                    <th className="text-left p-3">
                      Confiança
                    </th>
                    <th className="text-left p-3">
                      Motivo
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {gaps.map((gap) => (
                    <tr
                      key={`${gap.question_code}-${gap.question_type}`}
                      className="border-b border-zinc-800 hover:bg-zinc-900/60"
                    >
                      <td className="p-3">
                        <SeverityBadge severity={gap.severity} />
                      </td>

                      <td className="p-3 font-mono text-amber-400">
                        {gap.question_code}
                      </td>

                      <td className="p-3 text-zinc-300">
                        {gap.question_type}
                      </td>

                      <td className="p-3 font-semibold">
                        {gap.winning_answer}
                      </td>

                      <td className="p-3">
                        {gap.votes} / {gap.totalVotes}
                      </td>

                      <td className="p-3">
                        {Math.round(gap.confidence * 100)}%
                      </td>

                      <td className="p-3 text-zinc-400">
                        {gap.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

function SeverityBadge({
  severity,
}: {
  severity: 'high' | 'medium' | 'low'
}) {
  const label =
    severity === 'high'
      ? 'Crítico'
      : severity === 'medium'
        ? 'Médio'
        : 'Leve'

  const className =
    severity === 'high'
      ? 'border-red-800 bg-red-950/40 text-red-300'
      : severity === 'medium'
        ? 'border-amber-700 bg-amber-950/40 text-amber-300'
        : 'border-sky-700 bg-sky-950/40 text-sky-300'

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${className}`}>
      {label}
    </span>
  )
}
