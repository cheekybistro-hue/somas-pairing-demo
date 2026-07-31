import {
  FOOD_ARCHETYPES,
  WINE_PROFILES,
  getFoodArchetype,
  getWineProfile,
} from './pairing-taxonomy'
import {
  loadKnowledgeContributionReview,
  type ContributionQualityStatus,
  type KnowledgeContributionReviewItem,
} from './knowledge-quality'

export type CollectionPriority = 'complete' | 'medium' | 'high' | 'critical'

export type CollectionTargetModuleCode =
  | 'FORM1'
  | 'FORM2'
  | 'FORM3'
  | 'FORM4'
  | 'FORM5'
  | 'FORM21'

export type CollectionTargetPlan = {
  moduleCode: CollectionTargetModuleCode
  moduleName: string
  formPhase: string
  questionType: string
  targetResponses: number
  minExperts: number
  recommendedRole: string
  collectionGoal: string
}

export type KnowledgeCollectionTarget = {
  id: string
  moduleCode: CollectionTargetModuleCode
  moduleName: string
  formPhase: string
  questionCode: string
  questionType: string
  subjectCode: string
  subjectLabel: string
  recommendedRole: string
  collectionGoal: string
  targetResponses: number
  minExperts: number
  usableResponses: number
  readyResponses: number
  candidateResponses: number
  testSignals: number
  needsReview: number
  uniqueExperts: number
  missingResponses: number
  missingExperts: number
  priority: CollectionPriority
  priorityLabel: string
  actionLabel: string
  latestContributionAt?: string
  items: KnowledgeContributionReviewItem[]
}

export type KnowledgeCollectionModuleStats = {
  moduleCode: CollectionTargetModuleCode
  moduleName: string
  totalTargets: number
  completeTargets: number
  criticalTargets: number
  highTargets: number
  mediumTargets: number
  targetResponses: number
  usableResponses: number
  missingResponses: number
  coverageRatio: number
}

export type KnowledgeCollectionPlanStats = {
  totalTargets: number
  completeTargets: number
  criticalTargets: number
  highTargets: number
  mediumTargets: number
  targetResponses: number
  usableResponses: number
  missingResponses: number
  uniqueExperts: number
  modules: KnowledgeCollectionModuleStats[]
}

export type KnowledgeCollectionPlan = {
  generatedAt: string
  targets: KnowledgeCollectionTarget[]
  stats: KnowledgeCollectionPlanStats
}

const TARGET_PLANS: Record<CollectionTargetModuleCode, CollectionTargetPlan> = {
  FORM1: {
    moduleCode: 'FORM1',
    moduleName: 'Estrutura de Harmonização',
    formPhase: 'form_1_pairing_structure',
    questionType: 'pairing_choice',
    targetResponses: 3,
    minExperts: 3,
    recommendedRole: 'Sommelier / enólogo',
    collectionGoal: 'Validar que perfil vínico harmoniza com cada arquétipo gastronómico.',
  },
  FORM2: {
    moduleCode: 'FORM2',
    moduleName: 'Identidade Nacional',
    formPhase: 'form_2_national_identity',
    questionType: 'national_region',
    targetResponses: 3,
    minExperts: 3,
    recommendedRole: 'Sommelier / produtor / CVR',
    collectionGoal: 'Associar cada perfil vínico a regiões portuguesas representativas.',
  },
  FORM3: {
    moduleCode: 'FORM3',
    moduleName: 'Identidade Internacional',
    formPhase: 'form_3_international_identity',
    questionType: 'international_identity',
    targetResponses: 2,
    minExperts: 2,
    recommendedRole: 'Sommelier com prova internacional',
    collectionGoal: 'Criar pontes internacionais compreensíveis para cada perfil vínico.',
  },
  FORM4: {
    moduleCode: 'FORM4',
    moduleName: 'Wine Aromatic Intelligence',
    formPhase: 'wine_aromatic_intelligence',
    questionType: 'wine_aromatic_profile',
    targetResponses: 2,
    minExperts: 2,
    recommendedRole: 'Sommelier / provador',
    collectionGoal: 'Descrever famílias aromáticas dominantes por perfil vínico.',
  },
  FORM5: {
    moduleCode: 'FORM5',
    moduleName: 'Dish Intelligence',
    formPhase: 'dish_intelligence',
    questionType: 'dish_intelligence',
    targetResponses: 3,
    minExperts: 2,
    recommendedRole: 'Chef / sommelier de sala',
    collectionGoal: 'Recolher pratos reais, confeção e perfil sensorial por arquétipo.',
  },
  FORM21: {
    moduleCode: 'FORM21',
    moduleName: 'Relações Qualitativas',
    formPhase: 'form_2_1_qualitative_relationships',
    questionType: 'qualitative_relationship',
    targetResponses: 2,
    minExperts: 2,
    recommendedRole: 'Sommelier / enólogo',
    collectionGoal: 'Mapear semelhanças úteis entre perfis vínicos.',
  },
}

const USABLE_STATUSES: ContributionQualityStatus[] = ['ready', 'candidate']

function buildTargetDefinitions() {
  const foodTargets = FOOD_ARCHETYPES.flatMap((archetype) => [
    {
      plan: TARGET_PLANS.FORM1,
      questionCode: `${archetype.code}_PAIRING`,
      subjectCode: archetype.code,
      subjectLabel: `${archetype.code} — ${archetype.title}`,
    },
    {
      plan: TARGET_PLANS.FORM5,
      questionCode: `${archetype.code}_DISH_INTELLIGENCE`,
      subjectCode: archetype.code,
      subjectLabel: `${archetype.code} — ${archetype.title}`,
    },
  ])

  const wineTargets = WINE_PROFILES.flatMap((profile) => [
    {
      plan: TARGET_PLANS.FORM2,
      questionCode: `${profile.code}_NATIONAL_REGION`,
      subjectCode: profile.code,
      subjectLabel: `${profile.code} — ${profile.title}`,
    },
    {
      plan: TARGET_PLANS.FORM3,
      questionCode: `${profile.code}_INTERNATIONAL_IDENTITY`,
      subjectCode: profile.code,
      subjectLabel: `${profile.code} — ${profile.title}`,
    },
    {
      plan: TARGET_PLANS.FORM4,
      questionCode: `${profile.code}_AROMATIC_PROFILE`,
      subjectCode: profile.code,
      subjectLabel: `${profile.code} — ${profile.title}`,
    },
    {
      plan: TARGET_PLANS.FORM21,
      questionCode: `${profile.code}_QUALITATIVE_RELATIONSHIP`,
      subjectCode: profile.code,
      subjectLabel: `${profile.code} — ${profile.title}`,
    },
  ])

  return [...foodTargets, ...wineTargets]
}

function getPriorityLabel(priority: CollectionPriority) {
  if (priority === 'complete') return 'Completo'
  if (priority === 'critical') return 'Crítico'
  if (priority === 'high') return 'Alta prioridade'
  return 'Prioridade média'
}

function getPriority(
  usableResponses: number,
  missingResponses: number,
  missingExperts: number
): CollectionPriority {
  if (missingResponses === 0 && missingExperts === 0) return 'complete'
  if (usableResponses === 0) return 'critical'
  if (missingResponses >= 2 || missingExperts >= 2) return 'high'
  return 'medium'
}

function getActionLabel(target: {
  moduleCode: CollectionTargetModuleCode
  subjectCode: string
}) {
  if (target.moduleCode === 'FORM5') {
    const archetype = getFoodArchetype(target.subjectCode)
    return `Pedir pratos reais para ${archetype?.code ?? target.subjectCode}`
  }

  if (target.moduleCode === 'FORM4') {
    const profile = getWineProfile(target.subjectCode)
    return `Pedir perfil aromático para ${profile?.code ?? target.subjectCode}`
  }

  if (target.moduleCode === 'FORM2') {
    return `Pedir região portuguesa para ${target.subjectCode}`
  }

  if (target.moduleCode === 'FORM3') {
    return `Pedir referência internacional para ${target.subjectCode}`
  }

  if (target.moduleCode === 'FORM21') {
    return `Pedir relação qualitativa para ${target.subjectCode}`
  }

  return `Pedir harmonização para ${target.subjectCode}`
}

function buildTarget(
  definition: ReturnType<typeof buildTargetDefinitions>[number],
  items: KnowledgeContributionReviewItem[]
): KnowledgeCollectionTarget {
  const matchingItems = items.filter(
    (item) => item.questionCode === definition.questionCode
  )

  const usableItems = matchingItems.filter((item) =>
    USABLE_STATUSES.includes(item.status)
  )

  const readyResponses = matchingItems.filter(
    (item) => item.status === 'ready'
  ).length

  const candidateResponses = matchingItems.filter(
    (item) => item.status === 'candidate'
  ).length

  const testSignals = matchingItems.filter(
    (item) => item.status === 'test_signal'
  ).length

  const needsReview = matchingItems.filter(
    (item) => item.status === 'needs_review'
  ).length

  const uniqueExperts = new Set(usableItems.map((item) => item.expertId)).size
  const usableResponses = usableItems.length
  const missingResponses = Math.max(
    definition.plan.targetResponses - usableResponses,
    0
  )
  const missingExperts = Math.max(definition.plan.minExperts - uniqueExperts, 0)
  const priority = getPriority(usableResponses, missingResponses, missingExperts)

  const contributionDates = matchingItems
    .map((item) => item.createdAt)
    .filter(Boolean)
    .sort()

  const latestContributionAt = contributionDates[contributionDates.length - 1]

  return {
    id: `${definition.plan.moduleCode}:${definition.questionCode}`,
    moduleCode: definition.plan.moduleCode,
    moduleName: definition.plan.moduleName,
    formPhase: definition.plan.formPhase,
    questionCode: definition.questionCode,
    questionType: definition.plan.questionType,
    subjectCode: definition.subjectCode,
    subjectLabel: definition.subjectLabel,
    recommendedRole: definition.plan.recommendedRole,
    collectionGoal: definition.plan.collectionGoal,
    targetResponses: definition.plan.targetResponses,
    minExperts: definition.plan.minExperts,
    usableResponses,
    readyResponses,
    candidateResponses,
    testSignals,
    needsReview,
    uniqueExperts,
    missingResponses,
    missingExperts,
    priority,
    priorityLabel: getPriorityLabel(priority),
    actionLabel: getActionLabel({
      moduleCode: definition.plan.moduleCode,
      subjectCode: definition.subjectCode,
    }),
    latestContributionAt,
    items: matchingItems,
  }
}

function buildModuleStats(
  targets: KnowledgeCollectionTarget[]
): KnowledgeCollectionModuleStats[] {
  const moduleMap = new Map<CollectionTargetModuleCode, KnowledgeCollectionModuleStats>()

  targets.forEach((target) => {
    const previous = moduleMap.get(target.moduleCode) ?? {
      moduleCode: target.moduleCode,
      moduleName: target.moduleName,
      totalTargets: 0,
      completeTargets: 0,
      criticalTargets: 0,
      highTargets: 0,
      mediumTargets: 0,
      targetResponses: 0,
      usableResponses: 0,
      missingResponses: 0,
      coverageRatio: 0,
    }

    const next = {
      ...previous,
      totalTargets: previous.totalTargets + 1,
      completeTargets:
        previous.completeTargets + (target.priority === 'complete' ? 1 : 0),
      criticalTargets:
        previous.criticalTargets + (target.priority === 'critical' ? 1 : 0),
      highTargets: previous.highTargets + (target.priority === 'high' ? 1 : 0),
      mediumTargets:
        previous.mediumTargets + (target.priority === 'medium' ? 1 : 0),
      targetResponses: previous.targetResponses + target.targetResponses,
      usableResponses: previous.usableResponses + target.usableResponses,
      missingResponses: previous.missingResponses + target.missingResponses,
    }

    moduleMap.set(target.moduleCode, {
      ...next,
      coverageRatio:
        next.targetResponses > 0
          ? Math.min(next.usableResponses / next.targetResponses, 1)
          : 0,
    })
  })

  return Array.from(moduleMap.values()).sort((a, b) =>
    a.moduleCode.localeCompare(b.moduleCode)
  )
}

function buildStats(
  targets: KnowledgeCollectionTarget[],
  items: KnowledgeContributionReviewItem[]
): KnowledgeCollectionPlanStats {
  const targetResponses = targets.reduce(
    (sum, target) => sum + target.targetResponses,
    0
  )
  const usableResponses = targets.reduce(
    (sum, target) => sum + target.usableResponses,
    0
  )
  const missingResponses = targets.reduce(
    (sum, target) => sum + target.missingResponses,
    0
  )

  return {
    totalTargets: targets.length,
    completeTargets: targets.filter((target) => target.priority === 'complete')
      .length,
    criticalTargets: targets.filter((target) => target.priority === 'critical')
      .length,
    highTargets: targets.filter((target) => target.priority === 'high').length,
    mediumTargets: targets.filter((target) => target.priority === 'medium')
      .length,
    targetResponses,
    usableResponses,
    missingResponses,
    uniqueExperts: new Set(items.map((item) => item.expertId)).size,
    modules: buildModuleStats(targets),
  }
}

export async function loadKnowledgeCollectionPlan(): Promise<KnowledgeCollectionPlan> {
  const review = await loadKnowledgeContributionReview()
  const definitions = buildTargetDefinitions()

  const targets = definitions
    .map((definition) => buildTarget(definition, review.items))
    .sort((a, b) => {
      const order: Record<CollectionPriority, number> = {
        critical: 0,
        high: 1,
        medium: 2,
        complete: 3,
      }

      return (
        order[a.priority] - order[b.priority] ||
        a.moduleCode.localeCompare(b.moduleCode) ||
        a.subjectCode.localeCompare(b.subjectCode)
      )
    })

  return {
    generatedAt: new Date().toISOString(),
    targets,
    stats: buildStats(targets, review.items),
  }
}

export function toCollectionPlanJson(targets: KnowledgeCollectionTarget[]) {
  return JSON.stringify(targets, null, 2)
}
