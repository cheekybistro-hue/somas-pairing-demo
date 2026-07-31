import {
  loadKnowledgeCollectionPlan,
  type CollectionTargetModuleCode,
  type KnowledgeCollectionPlan,
  type KnowledgeCollectionTarget,
} from './knowledge-targets'

export type CollectionSessionAudience =
  | 'chefs'
  | 'sommeliers'
  | 'enologists'
  | 'cvr_producers'
  | 'somas_team'

export type CollectionSessionPriority = 'critical' | 'high' | 'medium'

export type KnowledgeCollectionSession = {
  id: string
  title: string
  audience: CollectionSessionAudience
  audienceLabel: string
  priority: CollectionSessionPriority
  priorityLabel: string
  objective: string
  recommendedDuration: string
  recommendedParticipants: string
  modules: CollectionTargetModuleCode[]
  moduleLabels: string[]
  targetCount: number
  missingResponses: number
  missingExperts: number
  criticalTargets: number
  highTargets: number
  suggestedTargets: KnowledgeCollectionTarget[]
  preparationNotes: string[]
  expectedOutput: string
}

export type KnowledgeCollectionSessionsPlanStats = {
  totalSessions: number
  criticalSessions: number
  highSessions: number
  totalSuggestedTargets: number
  totalMissingResponses: number
  generatedFromTargets: number
}

export type KnowledgeCollectionSessionsPlan = {
  generatedAt: string
  sourcePlan: KnowledgeCollectionPlan
  sessions: KnowledgeCollectionSession[]
  stats: KnowledgeCollectionSessionsPlanStats
}

type SessionTemplate = {
  id: string
  title: string
  audience: CollectionSessionAudience
  audienceLabel: string
  objective: string
  recommendedDuration: string
  recommendedParticipants: string
  modules: CollectionTargetModuleCode[]
  maxTargets: number
  preparationNotes: string[]
  expectedOutput: string
}

const SESSION_TEMPLATES: SessionTemplate[] = [
  {
    id: 'chefs-dish-intelligence',
    title: 'Sessão com chefs — pratos reais e perfil sensorial',
    audience: 'chefs',
    audienceLabel: 'Chefs / cozinha',
    objective:
      'Recolher pratos reais para cada arquétipo gastronómico, com método de confeção e perfil sensorial.',
    recommendedDuration: '45–60 min',
    recommendedParticipants: '2–4 chefs ou chef + sommelier de sala',
    modules: ['FORM5'],
    maxTargets: 12,
    preparationNotes: [
      'Preparar exemplos de pratos portugueses por arquétipo para desbloquear a conversa.',
      'Pedir pratos reais, não descrições genéricas.',
      'Focar confeção, acidez, salinidade, gordura/richness, umami, picante e intensidade.',
    ],
    expectedOutput:
      'Pratos reais por arquétipo, prontos para alimentar Dish Intelligence e documentos RAG.',
  },
  {
    id: 'sommeliers-pairing-structure',
    title: 'Sessão com sommeliers — harmonização estrutural',
    audience: 'sommeliers',
    audienceLabel: 'Sommeliers / sala',
    objective:
      'Validar que perfis vínicos harmonizam com cada arquétipo gastronómico.',
    recommendedDuration: '45–60 min',
    recommendedParticipants: '3 sommeliers ou sommelier + enólogo',
    modules: ['FORM1'],
    maxTargets: 12,
    preparationNotes: [
      'Começar pelos arquétipos críticos sem qualquer resposta útil.',
      'Pedir uma justificação curta para evitar respostas demasiado secas.',
      'Não tentar chegar a consenso na sessão; recolher contributos individuais primeiro.',
    ],
    expectedOutput:
      'Harmonizações arquétipo → perfil vínico com amostra mínima para consenso.',
  },
  {
    id: 'producers-cvr-national-identity',
    title: 'Sessão com produtores / CVR — identidade nacional',
    audience: 'cvr_producers',
    audienceLabel: 'Produtores / CVR',
    objective:
      'Associar perfis vínicos a regiões portuguesas representativas e reforçar leitura territorial.',
    recommendedDuration: '45 min',
    recommendedParticipants: '2–3 produtores, CVR ou profissionais de prova regional',
    modules: ['FORM2'],
    maxTargets: 12,
    preparationNotes: [
      'Levar a lista de perfis vínicos W01–W30 e pedir associação regional objetiva.',
      'Aceitar respostas objetivas sem comentário longo, desde que a região seja clara.',
      'Usar divergências regionais como sinal útil para consenso futuro.',
    ],
    expectedOutput:
      'Cobertura regional por perfil vínico para identidade portuguesa do SomAS.',
  },
  {
    id: 'sommeliers-aromatic-profiles',
    title: 'Sessão de prova — perfis aromáticos',
    audience: 'sommeliers',
    audienceLabel: 'Sommeliers / provadores',
    objective:
      'Descrever famílias aromáticas dominantes por perfil vínico para enriquecer embeddings e explicações.',
    recommendedDuration: '60 min',
    recommendedParticipants: '2–4 sommeliers, provadores ou enólogos',
    modules: ['FORM4'],
    maxTargets: 10,
    preparationNotes: [
      'Agrupar perfis por família: brancos, espumantes, rosés, tintos e licorosos.',
      'Pedir intensidades 0–5 apenas nas famílias aromáticas relevantes.',
      'Evitar preencher todas as famílias por defeito se não forem expressivas.',
    ],
    expectedOutput:
      'Matriz aromática W01–W30 para melhorar recomendação, explicabilidade e RAG.',
  },
  {
    id: 'international-benchmarks',
    title: 'Sessão com sommeliers — benchmarks internacionais',
    audience: 'sommeliers',
    audienceLabel: 'Sommeliers com prova internacional',
    objective:
      'Criar pontes internacionais para explicar os perfis SomAS usando regiões, castas e estilos reconhecíveis.',
    recommendedDuration: '45 min',
    recommendedParticipants: '2 sommeliers com experiência internacional',
    modules: ['FORM3'],
    maxTargets: 10,
    preparationNotes: [
      'Pedir analogias internacionais úteis, não equivalências absolutas.',
      'Pedir casta principal e, quando possível, uma referência concreta.',
      'Marcar casos incertos como candidatos até haver mais respostas.',
    ],
    expectedOutput:
      'Pontes internacionais W01–W30 para comunicação, onboarding e explicações ao utilizador.',
  },
  {
    id: 'wine-map-relationships',
    title: 'Sessão SomAS — relações entre perfis vínicos',
    audience: 'somas_team',
    audienceLabel: 'Equipa SomAS / sommeliers',
    objective:
      'Mapear semelhanças úteis entre perfis vínicos para navegação, fallback e recomendação alternativa.',
    recommendedDuration: '45 min',
    recommendedParticipants: '2 sommeliers + equipa SomAS',
    modules: ['FORM21'],
    maxTargets: 10,
    preparationNotes: [
      'Focar relações úteis para fallback: semelhante, muito semelhante ou alternativa próxima.',
      'Evitar relações demasiado genéricas entre perfis distantes.',
      'Usar estas respostas para melhorar navegação entre perfis e recomendação alternativa.',
    ],
    expectedOutput:
      'Mapa qualitativo entre perfis vínicos para fallback e explicabilidade.',
  },
]

const PRIORITY_ORDER = {
  critical: 0,
  high: 1,
  medium: 2,
  complete: 3,
} as const

function getPriorityLabel(priority: CollectionSessionPriority) {
  if (priority === 'critical') return 'Crítica'
  if (priority === 'high') return 'Alta'
  return 'Média'
}

function getSessionPriority(targets: KnowledgeCollectionTarget[]): CollectionSessionPriority {
  if (targets.some((target) => target.priority === 'critical')) return 'critical'
  if (targets.some((target) => target.priority === 'high')) return 'high'
  return 'medium'
}

function sortTargetsForSession(
  targets: KnowledgeCollectionTarget[]
): KnowledgeCollectionTarget[] {
  return [...targets].sort((a, b) => {
    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (priorityDiff !== 0) return priorityDiff

    const missingDiff = b.missingResponses - a.missingResponses
    if (missingDiff !== 0) return missingDiff

    return a.questionCode.localeCompare(b.questionCode)
  })
}

function buildSession(
  template: SessionTemplate,
  targets: KnowledgeCollectionTarget[]
): KnowledgeCollectionSession | null {
  const relevantTargets = sortTargetsForSession(
    targets.filter(
      (target) =>
        template.modules.includes(target.moduleCode) && target.priority !== 'complete'
    )
  ).slice(0, template.maxTargets)

  if (relevantTargets.length === 0) return null

  const priority = getSessionPriority(relevantTargets)
  const modules = Array.from(
    new Set(relevantTargets.map((target) => target.moduleCode))
  ) as CollectionTargetModuleCode[]

  return {
    id: template.id,
    title: template.title,
    audience: template.audience,
    audienceLabel: template.audienceLabel,
    priority,
    priorityLabel: getPriorityLabel(priority),
    objective: template.objective,
    recommendedDuration: template.recommendedDuration,
    recommendedParticipants: template.recommendedParticipants,
    modules,
    moduleLabels: Array.from(
      new Set(
        relevantTargets.map(
          (target) => `${target.moduleCode} · ${target.moduleName}`
        )
      )
    ),
    targetCount: relevantTargets.length,
    missingResponses: relevantTargets.reduce(
      (total, target) => total + target.missingResponses,
      0
    ),
    missingExperts: relevantTargets.reduce(
      (total, target) => total + target.missingExperts,
      0
    ),
    criticalTargets: relevantTargets.filter(
      (target) => target.priority === 'critical'
    ).length,
    highTargets: relevantTargets.filter((target) => target.priority === 'high')
      .length,
    suggestedTargets: relevantTargets,
    preparationNotes: template.preparationNotes,
    expectedOutput: template.expectedOutput,
  }
}

function sortSessions(
  sessions: KnowledgeCollectionSession[]
): KnowledgeCollectionSession[] {
  const audienceWeight: Record<CollectionSessionAudience, number> = {
    chefs: 0,
    sommeliers: 1,
    cvr_producers: 2,
    enologists: 3,
    somas_team: 4,
  }

  return [...sessions].sort((a, b) => {
    const priorityDiff =
      PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (priorityDiff !== 0) return priorityDiff

    const missingDiff = b.missingResponses - a.missingResponses
    if (missingDiff !== 0) return missingDiff

    return audienceWeight[a.audience] - audienceWeight[b.audience]
  })
}

function buildStats(
  sessions: KnowledgeCollectionSession[],
  sourcePlan: KnowledgeCollectionPlan
): KnowledgeCollectionSessionsPlanStats {
  return {
    totalSessions: sessions.length,
    criticalSessions: sessions.filter((session) => session.priority === 'critical')
      .length,
    highSessions: sessions.filter((session) => session.priority === 'high').length,
    totalSuggestedTargets: sessions.reduce(
      (total, session) => total + session.targetCount,
      0
    ),
    totalMissingResponses: sessions.reduce(
      (total, session) => total + session.missingResponses,
      0
    ),
    generatedFromTargets: sourcePlan.stats.totalTargets,
  }
}

export async function loadKnowledgeCollectionSessionsPlan(): Promise<KnowledgeCollectionSessionsPlan> {
  const sourcePlan = await loadKnowledgeCollectionPlan()
  const sessions = sortSessions(
    SESSION_TEMPLATES.map((template) => buildSession(template, sourcePlan.targets)).filter(
      Boolean
    ) as KnowledgeCollectionSession[]
  )

  return {
    generatedAt: new Date().toISOString(),
    sourcePlan,
    sessions,
    stats: buildStats(sessions, sourcePlan),
  }
}

export function toSessionsPlanJson(plan: KnowledgeCollectionSessionsPlan) {
  return JSON.stringify(plan, null, 2)
}
