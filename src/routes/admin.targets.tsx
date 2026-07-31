import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  loadKnowledgeCollectionPlan,
  toCollectionPlanJson,
  type CollectionPriority,
  type CollectionTargetModuleCode,
  type KnowledgeCollectionPlan,
  type KnowledgeCollectionTarget,
} from '../lib/knowledge/knowledge-targets'

export const Route = createFileRoute('/admin/targets')({
  component: AdminKnowledgeTargetsPage,
})

const PRIORITY_OPTIONS: Array<{
  value: 'all' | CollectionPriority
  label: string
}> = [
  { value: 'all', label: 'Todas as prioridades' },
  { value: 'critical', label: 'Críticos' },
  { value: 'high', label: 'Alta prioridade' },
  { value: 'medium', label: 'Prioridade média' },
  { value: 'complete', label: 'Completos' },
]

function AdminKnowledgeTargetsPage() {
  const [plan, setPlan] = useState<KnowledgeCollectionPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState<'all' | CollectionTargetModuleCode>(
    'all'
  )
  const [priorityFilter, setPriorityFilter] = useState<
    'all' | CollectionPriority
  >('all')
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null)

  useEffect(() => {
    void loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)

      const data = await loadKnowledgeCollectionPlan()

      setPlan(data)
      setSelectedTargetId(data.targets[0]?.id ?? null)
    } catch (err: any) {
      setError(err.message ?? 'Erro ao carregar plano de recolha')
    } finally {
      setLoading(false)
    }
  }

  const modules = useMemo(() => plan?.stats.modules ?? [], [plan])

  const filteredTargets = useMemo(() => {
    const value = search.trim().toLowerCase()
    const targets = plan?.targets ?? []

    return targets.filter((target) => {
      const matchesSearch = value
        ? [
            target.moduleCode,
            target.moduleName,
            target.questionCode,
            target.questionType,
            target.subjectCode,
            target.subjectLabel,
            target.recommendedRole,
            target.collectionGoal,
            target.actionLabel,
          ]
            .join(' ')
            .toLowerCase()
            .includes(value)
        : true

      const matchesModule =
        moduleFilter === 'all' ? true : target.moduleCode === moduleFilter

      const matchesPriority =
        priorityFilter === 'all' ? true : target.priority === priorityFilter

      return matchesSearch && matchesModule && matchesPriority
    })
  }, [moduleFilter, plan, priorityFilter, search])

  const selectedTarget = useMemo(
    () =>
      filteredTargets.find((target) => target.id === selectedTargetId) ??
      filteredTargets[0] ??
      null,
    [filteredTargets, selectedTargetId]
  )

  const topPriorities = useMemo(
    () =>
      (plan?.targets ?? [])
        .filter((target) => target.priority !== 'complete')
        .slice(0, 8),
    [plan]
  )

  function downloadFilteredJson() {
    const blob = new Blob([toCollectionPlanJson(filteredTargets)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'somas-knowledge-collection-targets.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  const stats = plan?.stats
  const overallCoverage = stats?.targetResponses
    ? Math.round((stats.usableResponses / stats.targetResponses) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <p className="text-sm uppercase tracking-widest text-amber-400 mb-2">
              SomAS Admin · PR15
            </p>

            <h1 className="text-4xl font-light">
              Contribution Targets
            </h1>

            <p className="text-zinc-400 mt-3 max-w-3xl">
              Plano operacional para orientar a recolha de dados junto de
              sommeliers, chefs, enólogos e outros especialistas. A página mostra
              que perguntas ainda precisam de respostas, quem deve ser chamado e
              que módulos já têm cobertura suficiente para consenso, exportação e
              RAG.
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
              disabled={filteredTargets.length === 0}
              className="px-4 py-2 rounded-xl border border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 text-sm disabled:opacity-50"
            >
              Exportar plano
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
            label="Alvos"
            value={stats?.totalTargets ?? 0}
            helper="Perguntas a cobrir"
          />

          <StatCard
            label="Cobertura"
            value={`${overallCoverage}%`}
            helper="Respostas úteis / alvo"
          />

          <StatCard
            label="Completos"
            value={stats?.completeTargets ?? 0}
            helper="Cobertura mínima atingida"
          />

          <StatCard
            label="Críticos"
            value={stats?.criticalTargets ?? 0}
            helper="Sem respostas úteis"
          />

          <StatCard
            label="Alta prioridade"
            value={stats?.highTargets ?? 0}
            helper="Ainda longe do alvo"
          />

          <StatCard
            label="Respostas em falta"
            value={stats?.missingResponses ?? 0}
            helper="Para meta mínima"
          />
        </section>

        <section className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar por módulo, arquétipo, perfil, papel..."
              className="lg:col-span-2 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 text-sm"
            />

            <select
              value={moduleFilter}
              onChange={(event) =>
                setModuleFilter(event.target.value as 'all' | CollectionTargetModuleCode)
              }
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 text-sm"
            >
              <option value="all">Todos os módulos</option>
              {modules.map((module) => (
                <option key={module.moduleCode} value={module.moduleCode}>
                  {module.moduleCode} · {module.moduleName}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as 'all' | CollectionPriority)
              }
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 text-sm"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-zinc-500 text-sm mt-4">
            {filteredTargets.length} alvo(s) visível(eis)
            {plan?.generatedAt
              ? ` · atualizado em ${new Date(plan.generatedAt).toLocaleString('pt-PT')}`
              : ''}
          </p>
        </section>

        <ModuleTargetDistribution modules={modules} />

        <PriorityPanel targets={topPriorities} />

        <section className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-6">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="text-zinc-400 p-8">
                A carregar plano de recolha...
              </div>
            ) : filteredTargets.length === 0 ? (
              <div className="text-zinc-400 p-8">
                Não há alvos para os filtros selecionados.
              </div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-700 text-zinc-400">
                      <th className="text-left p-3">Prioridade</th>
                      <th className="text-left p-3">Módulo</th>
                      <th className="text-left p-3">Alvo</th>
                      <th className="text-left p-3">Cobertura</th>
                      <th className="text-left p-3">Papel</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTargets.map((target) => (
                      <TargetRow
                        key={target.id}
                        target={target}
                        selected={target.id === selectedTarget?.id}
                        onSelect={() => setSelectedTargetId(target.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <TargetDetail target={selectedTarget} />
        </section>
      </div>
    </div>
  )
}

function ModuleTargetDistribution({
  modules,
}: {
  modules: KnowledgeCollectionPlan['stats']['modules']
}) {
  if (modules.length === 0) return null

  return (
    <section className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
            Distribuição de alvos
          </p>
          <h2 className="text-xl font-light">
            Onde precisamos de mais dados
          </h2>
        </div>

        <p className="text-sm text-zinc-500 max-w-2xl">
          Esta visão mostra a cobertura mínima por módulo. Ajuda a decidir se
          devemos chamar mais chefs, sommeliers, enólogos ou produtores para uma
          sessão de recolha focada.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {modules.map((module) => (
          <div
            key={module.moduleCode}
            className="bg-zinc-950 border border-zinc-700 rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="font-mono text-amber-300">
                  {module.moduleCode}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {module.moduleName}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-semibold text-zinc-100">
                  {Math.round(module.coverageRatio * 100)}%
                </div>
                <div className="text-xs text-zinc-500">cobertura</div>
              </div>
            </div>

            <ProgressBar value={module.coverageRatio} />

            <div className="grid grid-cols-2 gap-2 text-xs mt-4">
              <MiniStatus label="Alvos" value={module.totalTargets} />
              <MiniStatus label="Completos" value={module.completeTargets} />
              <MiniStatus label="Críticos" value={module.criticalTargets} />
              <MiniStatus label="Em falta" value={module.missingResponses} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function PriorityPanel({ targets }: { targets: KnowledgeCollectionTarget[] }) {
  if (targets.length === 0) return null

  return (
    <section className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
          Próximas sessões de recolha
        </p>
        <h2 className="text-xl font-light">
          Prioridades imediatas
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {targets.map((target) => (
          <div
            key={target.id}
            className="bg-zinc-950 border border-zinc-700 rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="font-mono text-sm text-amber-300">
                {target.moduleCode}
              </div>
              <PriorityBadge priority={target.priority} label={target.priorityLabel} />
            </div>

            <div className="font-medium text-zinc-100 line-clamp-2">
              {target.subjectLabel}
            </div>

            <div className="text-xs text-zinc-500 mt-2">
              {target.actionLabel}
            </div>

            <div className="text-xs text-zinc-400 mt-3">
              Falta: {target.missingResponses} resposta(s) ·{' '}
              {target.missingExperts} especialista(s)
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function TargetRow({
  target,
  selected,
  onSelect,
}: {
  target: KnowledgeCollectionTarget
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
      <td className="p-3 whitespace-nowrap">
        <PriorityBadge priority={target.priority} label={target.priorityLabel} />
      </td>

      <td className="p-3">
        <div className="font-mono text-amber-300">{target.moduleCode}</div>
        <div className="text-xs text-zinc-500 truncate max-w-[180px]">
          {target.moduleName}
        </div>
      </td>

      <td className="p-3">
        <div className="font-mono text-zinc-300">{target.questionCode}</div>
        <div className="text-xs text-zinc-500 truncate max-w-[280px]">
          {target.subjectLabel}
        </div>
      </td>

      <td className="p-3 min-w-[160px]">
        <div className="text-zinc-200">
          {target.usableResponses}/{target.targetResponses} respostas ·{' '}
          {target.uniqueExperts}/{target.minExperts} especialistas
        </div>
        <div className="text-xs text-zinc-500">
          {target.missingResponses} resposta(s) em falta
        </div>
      </td>

      <td className="p-3 text-zinc-400 max-w-[200px]">
        {target.recommendedRole}
      </td>
    </tr>
  )
}

function TargetDetail({ target }: { target: KnowledgeCollectionTarget | null }) {
  if (!target) {
    return (
      <aside className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 text-zinc-400">
        Seleciona um alvo para ver detalhe.
      </aside>
    )
  }

  return (
    <aside className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 space-y-5">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Detalhe do alvo
          </p>
          <PriorityBadge priority={target.priority} label={target.priorityLabel} />
        </div>

        <h2 className="text-2xl font-light leading-snug">
          {target.subjectLabel}
        </h2>

        <p className="text-zinc-400 mt-3 text-sm">
          {target.collectionGoal}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <InfoBox label="Módulo" value={`${target.moduleCode} · ${target.moduleName}`} />
        <InfoBox label="Tipo" value={target.questionType} />
        <InfoBox label="Papel recomendado" value={target.recommendedRole} />
        <InfoBox label="Ação" value={target.actionLabel} />
      </div>

      <div className="bg-zinc-950 border border-zinc-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-zinc-400">Cobertura mínima</span>
          <span className="text-sm text-zinc-200">
            {target.usableResponses}/{target.targetResponses}
          </span>
        </div>
        <ProgressBar
          value={
            target.targetResponses > 0
              ? Math.min(target.usableResponses / target.targetResponses, 1)
              : 0
          }
        />

        <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
          <MiniStatus label="Prontas" value={target.readyResponses} />
          <MiniStatus label="Candidatas" value={target.candidateResponses} />
          <MiniStatus label="Teste" value={target.testSignals} />
          <MiniStatus label="A rever" value={target.needsReview} />
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-zinc-500">Especialistas úteis</div>
            <div className="text-zinc-100 font-medium">
              {target.uniqueExperts}/{target.minExperts}
            </div>
          </div>

          <div>
            <div className="text-zinc-500">Último contributo</div>
            <div className="text-zinc-100 font-medium">
              {target.latestContributionAt
                ? new Date(target.latestContributionAt).toLocaleDateString('pt-PT')
                : 'Sem dados'}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-3">
          Contributos existentes
        </h3>

        {target.items.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Ainda não há contributos para este alvo.
          </p>
        ) : (
          <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
            {target.items.map((item) => (
              <div
                key={item.answerId}
                className="bg-zinc-950 border border-zinc-700 rounded-lg p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="truncate text-zinc-200">
                    {item.answerValue ?? '—'}
                  </div>
                  <span className="text-xs text-zinc-500 whitespace-nowrap">
                    {item.statusLabel}
                  </span>
                </div>

                <div className="text-xs text-zinc-500 mt-1">
                  {item.expertId.slice(0, 8)}… ·{' '}
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('pt-PT')
                    : 'sem data'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
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

function InfoBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-zinc-950 border border-zinc-700 rounded-xl p-3">
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
        {label}
      </div>
      <div className="text-zinc-200 break-words">{value}</div>
    </div>
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

function ProgressBar({ value }: { value: number }) {
  const percentage = Math.max(0, Math.min(value, 1)) * 100

  return (
    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
      <div
        className="h-full rounded-full bg-amber-400"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

function PriorityBadge({
  priority,
  label,
}: {
  priority: CollectionPriority
  label: string
}) {
  const classes = {
    complete: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/30',
    medium: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/30',
    high: 'border-amber-500/50 text-amber-300 bg-amber-950/30',
    critical: 'border-red-500/50 text-red-300 bg-red-950/30',
  }[priority]

  return (
    <span className={`inline-flex rounded-full border px-2 py-1 text-xs ${classes}`}>
      {label}
    </span>
  )
}
