import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  loadKnowledgeContributionReview,
  toContributionReviewJson,
  type ContributionQualityStatus,
  type KnowledgeContributionReview,
  type KnowledgeContributionReviewItem,
} from '../lib/knowledge/knowledge-quality'

export const Route = createFileRoute('/admin/quality')({
  component: AdminKnowledgeQualityPage,
})

const STATUS_OPTIONS: Array<{
  value: 'all' | ContributionQualityStatus
  label: string
}> = [
  { value: 'all', label: 'Todos' },
  { value: 'ready', label: 'Prontos' },
  { value: 'candidate', label: 'Candidatos' },
  { value: 'needs_review', label: 'A rever' },
  { value: 'test_signal', label: 'Sinais de teste' },
]

function AdminKnowledgeQualityPage() {
  const [review, setReview] = useState<KnowledgeContributionReview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<
    'all' | ContributionQualityStatus
  >('all')
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)

  useEffect(() => {
    void loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)

      const data = await loadKnowledgeContributionReview()

      setReview(data)
      setSelectedAnswerId(data.items[0]?.answerId ?? null)
    } catch (err: any) {
      setError(err.message ?? 'Erro ao carregar revisão de conhecimento')
    } finally {
      setLoading(false)
    }
  }

  const modules = useMemo(() => review?.stats.modules ?? [], [review])

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase()
    const items = review?.items ?? []

    return items.filter((item) => {
      const matchesSearch = value
        ? item.searchableText.includes(value)
        : true

      const matchesModule =
        moduleFilter === 'all' ? true : item.moduleCode === moduleFilter

      const matchesStatus =
        statusFilter === 'all' ? true : item.status === statusFilter

      return matchesSearch && matchesModule && matchesStatus
    })
  }, [moduleFilter, review, search, statusFilter])

  const selectedItem = useMemo(
    () =>
      filteredItems.find((item) => item.answerId === selectedAnswerId) ??
      filteredItems[0] ??
      null,
    [filteredItems, selectedAnswerId]
  )

  function downloadFilteredJson() {
    const blob = new Blob([toContributionReviewJson(filteredItems)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'somas-knowledge-contribution-review.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  const stats = review?.stats

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <p className="text-sm uppercase tracking-widest text-amber-400 mb-2">
              SomAS Admin · PR14.1
            </p>

            <h1 className="text-4xl font-light">
              Knowledge Quality Review
            </h1>

            <p className="text-zinc-400 mt-3 max-w-3xl">
              Visão operacional das respostas introduzidas por sommeliers,
              chefs e outros especialistas. O objetivo é ver o conhecimento a
              entrar no SomAS, identificar sinais de teste, acompanhar a distribuição por módulo
              e perceber que dados já podem alimentar consenso, exportação e RAG.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void loadData()}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-amber-400 text-amber-300 hover:bg-amber-400/10 text-sm disabled:opacity-50"
            >
              Atualizar
            </button>

            <button
              type="button"
              onClick={downloadFilteredJson}
              disabled={filteredItems.length === 0}
              className="px-4 py-2 rounded-xl border border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 text-sm disabled:opacity-50"
            >
              Exportar filtrados
            </button>
          </div>
        </header>

        {error && (
          <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-300">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          <StatCard
            label="Contributos"
            value={stats?.total ?? 0}
            helper="Respostas recebidas"
          />

          <StatCard
            label="Especialistas"
            value={stats?.uniqueExperts ?? 0}
            helper="Com respostas"
          />

          <StatCard
            label="Prontos"
            value={stats?.ready ?? 0}
            helper="Dados mais sólidos"
          />

          <StatCard
            label="Candidatos"
            value={stats?.candidate ?? 0}
            helper="Úteis, mas simples"
          />

          <StatCard
            label="Sinais de teste"
            value={stats?.testSignal ?? 0}
            helper="Possíveis respostas de teste"
          />

          <StatCard
            label="A rever"
            value={stats?.needsReview ?? 0}
            helper="Baixa confiança ou vazias"
          />
        </section>

        <section className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar por pergunta, resposta, especialista..."
              className="lg:col-span-2 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 text-sm"
            />

            <select
              value={moduleFilter}
              onChange={(event) => setModuleFilter(event.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 text-sm"
            >
              <option value="all">Todos os módulos</option>
              {modules.map((module) => (
                <option key={module.moduleCode} value={module.moduleCode}>
                  {module.moduleCode} · {module.moduleName ?? 'Sem nome'} ·{' '}
                  {module.count}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as 'all' | ContributionQualityStatus
                )
              }
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-zinc-500 text-sm mt-4">
            {filteredItems.length} contributo(s) visível(eis)
            {review?.generatedAt
              ? ` · atualizado em ${new Date(review.generatedAt).toLocaleString('pt-PT')}`
              : ''}
          </p>
        </section>

        <ModuleDistribution modules={modules} />

        <section className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="text-zinc-400 p-8">
                A carregar contributos...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-zinc-400 p-8">
                Não há contributos para os filtros selecionados.
              </div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-700 text-zinc-400">
                      <th className="text-left p-3">Data</th>
                      <th className="text-left p-3">Módulo</th>
                      <th className="text-left p-3">Questão</th>
                      <th className="text-left p-3">Resposta</th>
                      <th className="text-left p-3">Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item) => (
                      <ContributionRow
                        key={item.answerId}
                        item={item}
                        selected={item.answerId === selectedItem?.answerId}
                        onSelect={() => setSelectedAnswerId(item.answerId)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <ContributionDetail item={selectedItem} />
        </section>
      </div>
    </div>
  )
}


function ModuleDistribution({
  modules,
}: {
  modules: KnowledgeContributionReview['stats']['modules']
}) {
  if (modules.length === 0) {
    return null
  }

  return (
    <section className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
            Distribuição por módulo
          </p>
          <h2 className="text-xl font-light">
            Onde o conhecimento está a entrar
          </h2>
        </div>

        <p className="text-sm text-zinc-500 max-w-2xl">
          Esta visão ajuda a perceber rapidamente se os contributos estão
          concentrados em poucos formulários ou se a recolha já cobre várias
          camadas do SomAS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
        {modules.map((module) => (
          <div
            key={module.moduleCode}
            className="bg-zinc-950 border border-zinc-700 rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="font-mono text-amber-300">
                  {module.moduleCode}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {module.moduleName ?? 'Sem nome'}
                </div>
              </div>

              <div className="text-2xl font-semibold text-zinc-100">
                {module.count}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <MiniStatus label="Prontos" value={module.ready} />
              <MiniStatus label="Candidatos" value={module.candidate} />
              <MiniStatus label="Teste" value={module.testSignal} />
              <MiniStatus label="Rever" value={module.needsReview} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function MiniStatus({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1">
      <div className="text-zinc-500">{label}</div>
      <div className="text-zinc-200 font-medium">{value}</div>
    </div>
  )
}

function ContributionRow({
  item,
  selected,
  onSelect,
}: {
  item: KnowledgeContributionReviewItem
  selected: boolean
  onSelect: () => void
}) {
  return (
    <tr
      className={`border-b border-zinc-800 cursor-pointer hover:bg-zinc-900/70 ${
        selected ? 'bg-amber-400/10' : ''
      }`}
      onClick={onSelect}
    >
      <td className="p-3 text-zinc-400 whitespace-nowrap">
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('pt-PT')
          : '—'}
      </td>

      <td className="p-3">
        <div className="font-mono text-amber-300">{item.moduleCode}</div>
        <div className="text-xs text-zinc-500 truncate max-w-[180px]">
          {item.moduleName ?? '—'}
        </div>
      </td>

      <td className="p-3">
        <div className="font-mono text-zinc-300">{item.questionCode}</div>
        <div className="text-xs text-zinc-500 truncate max-w-[240px]">
          {item.subjectLabel ?? item.questionType}
        </div>
      </td>

      <td className="p-3 max-w-[260px]">
        <div className="truncate text-zinc-200">
          {item.answerValue ?? '—'}
        </div>
        <div className="text-xs text-zinc-500">
          Confiança: {Math.round(Number(item.confidence ?? 0) * 100)}%
        </div>
      </td>

      <td className="p-3">
        <StatusBadge status={item.status} label={item.statusLabel} />
      </td>
    </tr>
  )
}

function ContributionDetail({
  item,
}: {
  item: KnowledgeContributionReviewItem | null
}) {
  if (!item) {
    return (
      <aside className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 text-zinc-400">
        Seleciona um contributo para ver detalhe.
      </aside>
    )
  }

  return (
    <aside className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 space-y-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-amber-400 mb-2">
          Detalhe do contributo
        </p>

        <h2 className="text-xl font-light">
          {item.subjectLabel ?? item.questionCode}
        </h2>

        <p className="text-zinc-500 text-sm mt-2">
          {item.questionText ?? item.questionType}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <InfoBox label="Módulo" value={`${item.moduleCode} · ${item.moduleName ?? '—'}`} />
        <InfoBox label="Tipo" value={item.questionType} />
        <InfoBox label="Especialista" value={shortId(item.expertId)} />
        <InfoBox
          label="Confiança"
          value={`${Math.round(Number(item.confidence ?? 0) * 100)}%`}
        />
      </div>

      <div>
        <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
          Resposta
        </div>
        <div className="bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-zinc-200">
          {item.answerValue ?? '—'}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
          Sinais de qualidade
        </div>

        {item.signals.length === 0 ? (
          <div className="text-emerald-300 text-sm">
            Sem sinais críticos automáticos.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {item.signals.map((signal) => (
              <span
                key={signal.code}
                className="text-xs px-2 py-1 rounded-full border border-zinc-600 text-zinc-300"
              >
                {signal.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <details className="bg-zinc-950 border border-zinc-700 rounded-xl p-4">
        <summary className="cursor-pointer text-sm text-zinc-300">
          Ver normalização / JSON
        </summary>

        <pre className="text-xs text-zinc-400 mt-4 whitespace-pre-wrap overflow-auto max-h-[420px]">
          {JSON.stringify(
            {
              normalized: item.normalized,
              answerJson: item.answerJson,
            },
            null,
            2
          )}
        </pre>
      </details>
    </aside>
  )
}

function StatusBadge({
  status,
  label,
}: {
  status: ContributionQualityStatus
  label: string
}) {
  const className =
    status === 'ready'
      ? 'border-emerald-500 text-emerald-300 bg-emerald-500/10'
      : status === 'candidate'
        ? 'border-cyan-500 text-cyan-300 bg-cyan-500/10'
        : status === 'needs_review'
          ? 'border-amber-500 text-amber-300 bg-amber-500/10'
          : 'border-red-500 text-red-300 bg-red-500/10'

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${className}`}>
      {label}
    </span>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-950 border border-zinc-700 rounded-xl p-3">
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
        {label}
      </div>
      <div className="text-zinc-200 break-words">{value}</div>
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

      <div className="text-2xl font-semibold">{value}</div>

      <div className="text-sm text-zinc-500 mt-1">{helper}</div>
    </div>
  )
}

function shortId(value: string) {
  return value ? `${value.slice(0, 8)}…` : '—'
}
