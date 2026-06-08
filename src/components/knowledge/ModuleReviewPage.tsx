import { useEffect, useState } from 'react'

import { loadModuleAnswers } from '../../lib/knowledge/review-service'
import { ModuleReviewCard } from './ModuleReviewCard'

type Props = {
  expertId: string
  formPhase: string
  moduleName: string

  onBack: () => void
  onContinue: () => void
}

export function ModuleReviewPage({
  expertId,
  formPhase,
  moduleName,
  onBack,
  onContinue,
}: Props) {
  const [answers, setAnswers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        const data =
          await loadModuleAnswers(
            expertId,
            formPhase
          )

        setAnswers(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar respostas'
        )
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [expertId, formPhase])

  if (loading) {
    return (
      <div className="text-zinc-400">
        A carregar respostas...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-400">
        {error}
      </div>
    )
  }

  return (
    <ModuleReviewCard
      moduleName={moduleName}
      answers={answers}
      onBack={onBack}
      onContinue={onContinue}
    />
  )
}
