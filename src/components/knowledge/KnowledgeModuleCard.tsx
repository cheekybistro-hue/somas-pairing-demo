type KnowledgeModule = {
  module_code: string
  module_name: string
  description: string | null
  form_phase: string
  sort_order: number
  estimated_questions: number
  active: boolean
}

type Progress = {
  form_phase: string
  status: string
  questions_answered: number
  completed_at: string | null
  updated_at?: string | null
}

type Props = {
  module: KnowledgeModule
  progress?: Progress
  onStart: (module: KnowledgeModule) => void
  onReview?: (module: KnowledgeModule) => void
}

export function KnowledgeModuleCard({
  module,
  progress,
  onStart,
  onReview,
}: Props) {
  const answered = progress?.questions_answered ?? 0
  const total =
  module.estimated_questions && module.estimated_questions > 0
    ? module.estimated_questions
    : progress?.total_questions ?? 0

  const percent =
    total > 0
      ? Math.min(Math.round((answered / total) * 100), 100)
      : 0

  const statusLabel =
    progress?.status === 'completed'
      ? 'Completo'
      : answered > 0
        ? 'Em curso'
        : 'Por iniciar'

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-5 hover:border-amber-400/60 transition">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-400 mb-1">
            {module.module_code}
          </div>

          <h3 className="text-lg font-semibold text-zinc-100">
            {module.module_name}
          </h3>
        </div>

        <div className="text-sm text-zinc-400 whitespace-nowrap">
          {answered} / {total}
        </div>
      </div>

      {module.description && (
        <p className="text-sm text-zinc-400 min-h-[40px]">
          {module.description}
        </p>
      )}

      <div className="mt-4">
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-amber-400"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>{statusLabel}</span>
          <span>{percent}%</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onStart(module)}
          className="flex-1 rounded-xl px-3 py-2 bg-amber-500 text-black text-sm font-medium hover:bg-amber-400"
        >
          Continuar
        </button>

        <button
          type="button"
          onClick={() => onReview?.(module)}
          disabled={!onReview || answered === 0}
          className="flex-1 rounded-xl px-3 py-2 border border-zinc-600 text-zinc-300 text-sm hover:border-amber-400 hover:text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Rever respostas
        </button>
      </div>
    </div>
  )
}
