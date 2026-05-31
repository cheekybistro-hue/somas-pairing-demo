import { ArrowRight, Target } from 'lucide-react'

type Props = {
  recommendation: {
    title: string
    text: string
    module: any | null
  }
  onContinue: (module: any) => void
}

export default function KnowledgeRecommendationCard({
  recommendation,
  onContinue,
}: Props) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-semibold">Próxima recomendação</h3>
      </div>

      <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-5">
        <div className="text-xs uppercase tracking-widest text-amber-400 mb-2">
          SomAS sugere
        </div>

        <div className="text-xl font-semibold mb-2">
          {recommendation.title}
        </div>

        <p className="text-sm text-zinc-400">
          {recommendation.text}
        </p>

        {recommendation.module && (
          <button
            type="button"
            onClick={() => onContinue(recommendation.module)}
            className="mt-5 inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
          >
            Continuar módulo
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
