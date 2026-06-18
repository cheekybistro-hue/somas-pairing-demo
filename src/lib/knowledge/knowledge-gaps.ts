import type {
  KnowledgeDashboardMetrics,
} from './dashboard-metrics'

export type KnowledgeGap = {
  moduleCode: string
  moduleName: string
  answered: number
  total: number
  missing: number
  coveragePercent: number
}

export function calculateKnowledgeGaps(
  metrics: KnowledgeDashboardMetrics
): KnowledgeGap[] {
  return metrics.answersByModule
    .map((module) => ({
      moduleCode: module.moduleCode,
      moduleName: module.moduleName,
      answered: module.answered,
      total: module.total,
      missing: Math.max(
        module.total - module.answered,
        0
      ),
      coveragePercent: module.percent,
    }))
    .sort((a, b) => b.missing - a.missing)
}
