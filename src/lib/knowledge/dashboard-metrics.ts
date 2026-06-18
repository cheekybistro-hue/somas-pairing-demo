import type {
  KnowledgeModule,
  Progress,
} from './knowledge-types'

export type ModuleMetric = {
  moduleCode: string
  moduleName: string
  formPhase: string
  answered: number
  total: number
  percent: number
  status: string
}

export type KnowledgeDashboardMetrics = {
  totalAnswers: number
  totalQuestions: number
  coveragePercent: number
  totalModules: number
  startedModules: number
  completedModules: number
  answersByModule: ModuleMetric[]
}

export function calculateDashboardMetrics(
  modules: KnowledgeModule[],
  progress: Record<string, Progress>
): KnowledgeDashboardMetrics {
  const answersByModule = modules.map((module) => {
    const moduleProgress =
      progress[module.form_phase]

    const answered =
      moduleProgress?.questions_answered ?? 0

    const total =
      module.estimated_questions &&
      module.estimated_questions > 0
        ? module.estimated_questions
        : moduleProgress?.total_questions ?? 0

    const percent =
      total > 0
        ? Math.min(
            Math.round((answered / total) * 100),
            100
          )
        : 0

    return {
      moduleCode: module.module_code,
      moduleName: module.module_name,
      formPhase: module.form_phase,
      answered,
      total,
      percent,
      status:
        moduleProgress?.status ??
        (answered > 0 ? 'in_progress' : 'not_started'),
    }
  })

  const totalAnswers = answersByModule.reduce(
    (sum, item) => sum + item.answered,
    0
  )

  const totalQuestions = answersByModule.reduce(
    (sum, item) => sum + item.total,
    0
  )

  const coveragePercent =
    totalQuestions > 0
      ? Math.min(
          Math.round((totalAnswers / totalQuestions) * 100),
          100
        )
      : 0

  return {
    totalAnswers,
    totalQuestions,
    coveragePercent,
    totalModules: modules.length,
    startedModules: answersByModule.filter(
      (item) => item.answered > 0
    ).length,
    completedModules: answersByModule.filter(
      (item) =>
        item.total > 0 &&
        item.answered >= item.total
    ).length,
    answersByModule,
  }
}
