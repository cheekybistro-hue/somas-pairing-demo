import { createFileRoute } from '@tanstack/react-router'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import {
  loadKnowledgeCollectionSessionsPlan,
  toSessionsPlanJson,
  type CollectionSessionAudience,
  type KnowledgeCollectionSession,
  type KnowledgeCollectionSessionsPlan,
} from '../lib/knowledge/knowledge-sessions-plan'

export const Route = createFileRoute('/admin/sessions')({
  component: AdminKnowledgeSessionsPage,
})

const AUDIENCE_OPTIONS: Array<{
  value: 'all' | CollectionSessionAudience
  label: string
}> = [
  { value: 'all', label: 'Todos os perfis' },
  { value: 'chefs', label: 'Chefs' },
  { value: 'sommeliers', label: 'Sommeliers' },
  { value: 'cvr_producers', label: 'Produtores / CVR' },
  { value: 'somas_team', label: 'Equipa SomAS' },
]

function AdminKnowledgeSessionsPage() {
  const [plan, setPlan] = useState<KnowledgeCollectionSessionsPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [audienceFilter, setAudienceFilter] = useState<
    'all' | CollectionSessionAudience
  >('all')
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  useEffect(() => {
    void loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)

      const data = await loadKnowledgeCollectionSessionsPlan()

      setPlan(data)
      setSelectedSessionId(data.sessions[0]?.id ?? null)
    } catch (err: any) {
      setError(err.message ?? 'Erro ao carregar plano de sessões')
    } finally {
      setLoading(false)
    }
  }

  const filteredSessions = useMemo(() => {
    const value = search.trim().toLowerCase()
    const sessions = plan?.sessions ?? []

    return sessions.filter((session) => {
      const matchesSearch = value
        ? [
            session.title,
            session.audienceLabel,
            session.objective,
            session.expectedOutput,
            session.moduleLabels.join(' '),
            session.suggestedTargets
              .map((target) => `${target.questionCode} ${target.subjectLabel}`)
              .join(' '),
          ]
            .join(' ')
            .toLowerCase()
            .includes(value)
        : true

      const matchesAudience =
        audienceFilter === 'all' || session.audience === audienceFilter

      return matchesSearch && matchesAudience
    })
  }, [audienceFilter, plan, search])

  const selectedSession = useMemo(() => {
    return (
      filteredSessions.find((session) => session.id === selectedSessionId) ??
      filteredSessions[0] ??
      null
    )
  }, [filteredSessions, selectedSessionId])

  function exportPlan() {
    if (!plan) return

    const blob = new Blob([toSessionsPlanJson(plan)], {
      type: 'application/json;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'somas-collection-sessions-plan.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  function quickFilter(audience: 'all' | CollectionSessionAudience) {
    setAudienceFilter(audience)
    setSearch('')
  }

  if (loading) {
    return (
      <PageShell>
        <p className="text-zinc-400">A carregar plano de sessões...</p>
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell>
        <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-red-200">
          {error}
        </div>
      </PageShell>
    )
  }

  if (!plan) {
    return (
      <PageShell>
        <p className="text-zinc-400">Sem plano de sessões disponível.</p>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-2 text-sm uppercase tracking-widest text-amber-400">
            SomAS Admin · PR16
          </p>
          <h1 className="text-4xl font-light">Specialist Collection Sessions</h1>
          <p className="mt-3 max-w-4xl text-zinc-400">
            Plano prático para transformar os alvos de recolha em sessões com
            chefs, sommeliers, enólogos, produtores, CVR e equipa SomAS. Esta
            página responde a uma pergunta simples: quem devemos chamar, para
            recolher que dados e com que objetivo.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => void loadData()}
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-amber-400"
          >
            Atualizar
          </button>
          <button
            onClick={exportPlan}
            className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-300"
          >
            Exportar sessões
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Sessões"
          value={plan.stats.totalSessions}
          helper="Planos sugeridos"
        />
        <StatCard
          label="Críticas"
          value={plan.stats.criticalSessions}
          helper="Devem avançar primeiro"
        />
        <StatCard
          label="Alvos sugeridos"
          value={plan.stats.totalSuggestedTargets}
          helper="Nesta ronda de sessões"
        />
        <StatCard
          label="Respostas em falta"
          value={plan.stats.totalMissingResponses}
          helper="Nos alvos sugeridos"
        />
        <StatCard
          label="Base de alvos"
          value={plan.stats.generatedFromTargets}
          helper="Do PR15"
        />
      </section>

      <section className="rounded-2xl border border-zinc-700 bg-zinc-900/70 p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar por sessão, módulo, arquétipo, perfil ou objetivo..."
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-amber-400"
          />

          <select
            value={audienceFilter}
            onChange={(event) =>
              setAudienceFilter(event.target.value as 'all' | CollectionSessionAudience)
            }
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-amber-400"
          >
            {AUDIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <QuickButton onClick={() => quickFilter('chefs')}>Chefs · FORM5</QuickButton>
          <QuickButton onClick={() => quickFilter('sommeliers')}>
            Sommeliers
          </QuickButton>
          <QuickButton onClick={() => quickFilter('cvr_producers')}>
            Produtores / CVR
          </QuickButton>
          <QuickButton onClick={() => quickFilter('all')}>Limpar filtros</QuickButton>
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          {filteredSessions.length} sessão(ões) visível(eis) · atualizado em{' '}
          {new Date(plan.generatedAt).toLocaleString('pt-PT')}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {filteredSessions.map((session) => (
          <button
            key={session.id}
            onClick={() => setSelectedSessionId(session.id)}
            className={`rounded-2xl border p-5 text-left transition ${
              selectedSession?.id === session.id
                ? 'border-amber-400 bg-amber-400/10'
                : 'border-zinc-700 bg-zinc-900/60 hover:border-amber-400/60'
            }`}
          >
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge tone={session.priority}>{session.priorityLabel}</Badge>
              <Badge>{session.audienceLabel}</Badge>
            </div>

            <h2 className="text-xl font-semibold text-zinc-100">{session.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {session.objective}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <MiniMetric label="Alvos" value={session.targetCount} />
              <MiniMetric label="Faltam" value={session.missingResponses} />
              <MiniMetric label="Críticos" value={session.criticalTargets} />
              <MiniMetric label="Duração" value={session.recommendedDuration} />
            </div>
          </button>
        ))}
      </section>

      {selectedSession ? <SessionDetail session={selectedSession} /> : null}
    </PageShell>
  )
}

function SessionDetail({ session }: { session: KnowledgeCollectionSession }) {
  return (
    <section className="rounded-2xl border border-zinc-700 bg-zinc-900/70 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge tone={session.priority}>{session.priorityLabel}</Badge>
            <Badge>{session.audienceLabel}</Badge>
          </div>
          <h2 className="text-2xl font-light text-zinc-100">{session.title}</h2>
          <p className="mt-3 max-w-4xl text-zinc-400">{session.objective}</p>
        </div>

        <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm text-zinc-300 lg:w-72">
          <div className="text-xs uppercase tracking-widest text-zinc-500">
            Participantes sugeridos
          </div>
          <div className="mt-2 font-medium text-zinc-100">
            {session.recommendedParticipants}
          </div>
          <div className="mt-3 text-xs uppercase tracking-widest text-zinc-500">
            Duração
          </div>
          <div className="mt-1 text-zinc-100">{session.recommendedDuration}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Alvos da sessão" value={session.targetCount} helper="Perguntas focadas" />
        <StatCard label="Respostas em falta" value={session.missingResponses} helper="Para meta mínima" />
        <StatCard label="Alvos críticos" value={session.criticalTargets} helper="Sem respostas úteis" />
        <StatCard label="Alvos alta prioridade" value={session.highTargets} helper="Ainda abaixo do alvo" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-950/60 p-5">
          <h3 className="text-lg font-medium text-zinc-100">Preparação</h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-400">
            {session.preparationNotes.map((note) => (
              <li key={note} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-zinc-950/60 p-5">
          <h3 className="text-lg font-medium text-zinc-100">Resultado esperado</h3>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            {session.expectedOutput}
          </p>
          <div className="mt-5 text-xs uppercase tracking-widest text-zinc-500">
            Módulos incluídos
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {session.moduleLabels.map((label) => (
              <Badge key={label}>{label}</Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-lg font-medium text-zinc-100">
          Alvos sugeridos para esta sessão
        </h3>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {session.suggestedTargets.map((target) => (
            <div
              key={target.id}
              className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4"
            >
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge tone={target.priority}>{target.priorityLabel}</Badge>
                <Badge>{target.moduleCode}</Badge>
              </div>
              <div className="text-xs uppercase tracking-widest text-zinc-500">
                {target.questionCode}
              </div>
              <div className="mt-1 font-medium text-zinc-100">
                {target.subjectLabel}
              </div>
              <div className="mt-2 text-sm text-zinc-400">{target.actionLabel}</div>
              <div className="mt-3 text-sm text-amber-300">
                {target.usableResponses}/{target.targetResponses} úteis · faltam{' '}
                {target.missingResponses}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-8">{children}</div>
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
    <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-5">
      <div className="mb-2 text-xs uppercase tracking-widest text-zinc-500">
        {label}
      </div>
      <div className="text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-zinc-500">{helper}</div>
    </div>
  )
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-3">
      <div className="text-xs uppercase tracking-widest text-zinc-500">{label}</div>
      <div className="mt-1 font-medium text-zinc-100">{value}</div>
    </div>
  )
}

function QuickButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-zinc-700 px-3 py-1.5 text-zinc-300 hover:border-amber-400 hover:text-amber-300"
    >
      {children}
    </button>
  )
}

function Badge({
  children,
  tone,
}: {
  children: ReactNode
  tone?: 'critical' | 'high' | 'medium' | 'complete'
}) {
  const classes =
    tone === 'critical'
      ? 'border-red-500/40 bg-red-500/10 text-red-200'
      : tone === 'high'
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
        : tone === 'medium'
          ? 'border-sky-500/40 bg-sky-500/10 text-sky-200'
          : tone === 'complete'
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
            : 'border-zinc-700 bg-zinc-800 text-zinc-300'

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs ${classes}`}>
      {children}
    </span>
  )
}
