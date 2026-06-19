import type {
  KnowledgeDashboardMetrics,
} from './dashboard-metrics'

export type ConsensusReadiness = {
  totalQuestions: number
  answeredQuestions: number
  unansweredQuestions: number
  readinessPercent: number
}

export function calculateConsensusReadiness(
  metrics: KnowledgeDashboardMetrics
): ConsensusReadiness {
  const totalQuestions =
    metrics.totalQuestions

  const answeredQuestions =
    metrics.totalAnswers

  const unansweredQuestions =
    Math.max(
      totalQuestions - answeredQuestions,
      0
    )

  const readinessPercent =
    totalQuestions > 0
      ? Math.round(
          (answeredQuestions /
            totalQuestions) *
            100
        )
      : 0

  return {
    totalQuestions,
    answeredQuestions,
    unansweredQuestions,
    readinessPercent,
  }
}
