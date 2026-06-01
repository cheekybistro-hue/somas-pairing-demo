import { KnowledgeModuleCard } from './KnowledgeModuleCard'

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
  moduleCards: KnowledgeModule[]
  progress: Record<string, Progress>
  onStart: (module: KnowledgeModule) => void
}

export default function KnowledgeModuleSelection({
  moduleCards,
  progress,
  onStart,
}: Props) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8">
      <h2 className="text-2xl font-light mb-2">
        Escolher módulo de conhecimento
      </h2>

      <p className="text-zinc-400 mb-8">
        Para evitar entrevistas demasiado longas, cada módulo é preenchido separadamente.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {moduleCards.map((module) => (
          <KnowledgeModuleCard
            key={module.module_code}
            module={module}
            progress={progress[module.form_phase]}
            onStart={onStart}
          />
        ))}
      </div>
    </div>
  )
}
