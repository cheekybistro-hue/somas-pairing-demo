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
  updated_at: string | null
}

type KnowledgeModuleCardProps = {
  module: KnowledgeModule
  progress?: Progress
  onStart: (module: KnowledgeModule) => void
}

export function KnowledgeModuleCard({ module, progress, onStart }: KnowledgeModuleCardProps) {
  const answered = progress?.questions_answered ?? 0
  const total = module.estimated_questions || 0
  const percent = total > 0 ? Math.min(Math.round((answered / total) * 100), 100) : 0
  const disabled = total === 0

  const statusLabel =
    progress?.status === 'completed'
      ? 'Completo'
      : progress?.status === 'in_progress'
        ? 'Em curso'
        : 'Não iniciado'

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onStart(module)}
      className={`text-left p-5 rounded-2xl border transition-all ${
        disabled
          ? 'border-zinc-800 bg-zinc-900/30 opacity-60 cursor-not-allowed'
          : 'border-zinc-700 bg-zinc-900/40 hover:border-amber-400/70'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-mono text-amber-400">{module.module_code}</span>
        <span className="text-xs text-zinc-400">
          {answered} / {total}
        </span>
      </div>

      <h3 className="text-xl font-semibold mb-2">{module.module_name}</h3>
      <p className="text-sm text-zinc-400 mb-4">{module.description}</p>

      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div className="h-full bg-amber-400" style={{ width: `${percent}%` }} />
      </div>

      <div className="flex justify-between mt-2 text-xs text-zinc-500">
        <span>{statusLabel}</span>
        <span>{percent}%</span>
      </div>
    </button>
  )
}
