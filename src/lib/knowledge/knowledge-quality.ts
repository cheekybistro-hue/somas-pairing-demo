import {
  buildKnowledgeExportBundle,
  type RawKnowledgeExportAnswer,
} from './knowledge-export'

export type ContributionQualityStatus =
  | 'ready'
  | 'candidate'
  | 'needs_review'
  | 'test_signal'

export type ContributionQualitySignal = {
  code: string
  label: string
  severity: 'info' | 'warning' | 'danger'
}

export type KnowledgeContributionReviewItem = RawKnowledgeExportAnswer & {
  status: ContributionQualityStatus
  statusLabel: string
  signals: ContributionQualitySignal[]
  searchableText: string
}

export type KnowledgeContributionReviewStats = {
  total: number
  ready: number
  candidate: number
  needsReview: number
  testSignal: number
  uniqueExperts: number
  modules: Array<{
    moduleCode: string
    moduleName?: string
    count: number
  }>
}

export type KnowledgeContributionReview = {
  generatedAt: string
  items: KnowledgeContributionReviewItem[]
  stats: KnowledgeContributionReviewStats
}

const TEST_PATTERNS = [
  'test',
  'teste',
  'dsad',
  'asdf',
  'qwerty',
  'lorem',
  'opt',
]

function getStatusLabel(status: ContributionQualityStatus) {
  if (status === 'ready') return 'Pronto'
  if (status === 'candidate') return 'Candidato'
  if (status === 'needs_review') return 'Rever'
  return 'Sinal de teste'
}

function normalizeText(value: unknown) {
  return String(value ?? '').trim().toLowerCase()
}

function getReason(answer: RawKnowledgeExportAnswer) {
  const value = answer.answerJson.reason
  return typeof value === 'string' ? value.trim() : ''
}

function hasTestPattern(answer: RawKnowledgeExportAnswer) {
  const haystack = [
    answer.answerValue,
    getReason(answer),
    JSON.stringify(answer.answerJson),
  ]
    .map(normalizeText)
    .join(' ')

  return TEST_PATTERNS.some((pattern) => haystack.includes(pattern))
}

function hasUsefulAnswer(answer: RawKnowledgeExportAnswer) {
  if (answer.answerValue && answer.answerValue.trim().length > 0) {
    return true
  }

  return Object.keys(answer.normalized ?? {}).length > 0
}

function getSignals(answer: RawKnowledgeExportAnswer) {
  const signals: ContributionQualitySignal[] = []
  const confidence = Number(answer.confidence ?? 0)
  const reason = getReason(answer)

  if (!hasUsefulAnswer(answer)) {
    signals.push({
      code: 'empty_answer',
      label: 'Resposta vazia ou sem valor útil',
      severity: 'danger',
    })
  }

  if (hasTestPattern(answer)) {
    signals.push({
      code: 'test_pattern',
      label: 'Possível resposta de teste',
      severity: 'danger',
    })
  }

  if (confidence > 0 && confidence < 0.5) {
    signals.push({
      code: 'low_confidence',
      label: 'Confiança baixa',
      severity: 'warning',
    })
  }

  if (
    ['pairing_choice', 'national_region', 'international_identity'].includes(
      answer.questionType
    ) &&
    reason.length === 0
  ) {
    signals.push({
      code: 'missing_reason',
      label: 'Sem justificação textual',
      severity: 'info',
    })
  }

  return signals
}

function getStatus(
  answer: RawKnowledgeExportAnswer,
  signals: ContributionQualitySignal[]
): ContributionQualityStatus {
  if (signals.some((signal) => signal.code === 'test_pattern')) {
    return 'test_signal'
  }

  if (
    signals.some((signal) =>
      ['empty_answer', 'low_confidence'].includes(signal.code)
    )
  ) {
    return 'needs_review'
  }

  const reason = getReason(answer)

  if (reason.length >= 10 || answer.questionType === 'wine_aromatic_profile') {
    return 'ready'
  }

  if (answer.questionType === 'dish_intelligence') {
    return 'ready'
  }

  return 'candidate'
}

function buildSearchableText(answer: RawKnowledgeExportAnswer) {
  return [
    answer.moduleCode,
    answer.moduleName,
    answer.formPhase,
    answer.questionCode,
    answer.questionType,
    answer.questionText,
    answer.subjectCode,
    answer.subjectLabel,
    answer.answerValue,
    answer.expertId,
    getReason(answer),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function buildStats(items: KnowledgeContributionReviewItem[]) {
  const moduleMap = new Map<string, { moduleName?: string; count: number }>()

  items.forEach((item) => {
    const previous = moduleMap.get(item.moduleCode) ?? {
      moduleName: item.moduleName,
      count: 0,
    }

    moduleMap.set(item.moduleCode, {
      moduleName: previous.moduleName ?? item.moduleName,
      count: previous.count + 1,
    })
  })

  return {
    total: items.length,
    ready: items.filter((item) => item.status === 'ready').length,
    candidate: items.filter((item) => item.status === 'candidate').length,
    needsReview: items.filter((item) => item.status === 'needs_review').length,
    testSignal: items.filter((item) => item.status === 'test_signal').length,
    uniqueExperts: new Set(items.map((item) => item.expertId)).size,
    modules: Array.from(moduleMap.entries())
      .map(([moduleCode, value]) => ({
        moduleCode,
        moduleName: value.moduleName,
        count: value.count,
      }))
      .sort((a, b) => a.moduleCode.localeCompare(b.moduleCode)),
  }
}

export async function loadKnowledgeContributionReview(): Promise<KnowledgeContributionReview> {
  const bundle = await buildKnowledgeExportBundle()

  const items = bundle.rawAnswers
    .map((answer) => {
      const signals = getSignals(answer)
      const status = getStatus(answer, signals)

      return {
        ...answer,
        signals,
        status,
        statusLabel: getStatusLabel(status),
        searchableText: buildSearchableText(answer),
      }
    })
    .sort((a, b) => {
      const left = new Date(a.createdAt ?? 0).getTime()
      const right = new Date(b.createdAt ?? 0).getTime()
      return right - left
    })

  return {
    generatedAt: new Date().toISOString(),
    items,
    stats: buildStats(items),
  }
}

export function toContributionReviewJson(
  items: KnowledgeContributionReviewItem[]
) {
  return JSON.stringify(items, null, 2)
}
