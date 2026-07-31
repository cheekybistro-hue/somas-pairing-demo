import { supabase } from '@/lib/supabase'

import { getAromaticFamily } from './aromatic-taxonomy'
import { DISH_DIMENSIONS } from './dish-intelligence-form'
import { getFoodArchetype, getWineProfile } from './pairing-taxonomy'

export type KnowledgeExportStatus = 'draft' | 'usable' | 'strong'

export type RawKnowledgeExportAnswer = {
  answerId: string
  sessionId?: string
  expertId: string
  moduleCode: string
  moduleName?: string
  formPhase?: string
  questionCode: string
  questionType: string
  questionText?: string
  subjectCode?: string
  subjectLabel?: string
  answerValue: string | null
  answerJson: Record<string, unknown>
  normalized: Record<string, unknown>
  confidence: number | null
  createdAt?: string
  updatedAt?: string
}

export type ConsensusKnowledgeExportItem = {
  knowledgeId: string
  moduleCode: string
  moduleName?: string
  formPhase?: string
  questionCode: string
  questionType: string
  subjectCode?: string
  subjectLabel?: string
  consensusValue: string
  responseCount: number
  winningVotes: number
  agreementRatio: number
  averageConfidence?: number
  confidenceScore: number
  status: KnowledgeExportStatus
  updatedAt?: string
  metadata: Record<string, unknown>
}

export type EmbeddingKnowledgeExportDocument = {
  id: string
  type: string
  title: string
  text: string
  metadata: Record<string, unknown>
}

type KnowledgeAnswerRow = {
  id?: string
  session_id?: string
  expert_id?: string
  question_code: string
  question_text?: string | null
  answer_text?: string | null
  answer_json?: unknown
  confidence?: number | null
  created_at?: string
  updated_at?: string | null
}

type KnowledgeQuestionRow = {
  question_code: string
  form_phase?: string | null
  question_type?: string | null
  food_archetype_code?: string | null
  wine_profile_code?: string | null
  question_text?: string | null
}

type KnowledgeModuleRow = {
  module_code?: string | null
  module_name?: string | null
  form_phase?: string | null
}

type KnowledgeConsensusRow = {
  question_code: string
  question_type: string
  winning_answer: string | null
  votes?: number | null
  total_votes?: number | null
  confidence_score?: number | null
  updated_at?: string | null
}

function parseJsonRecord(value: unknown): Record<string, unknown> {
  if (!value) return {}

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return isRecord(parsed) ? parsed : {}
    } catch {
      return {}
    }
  }

  return isRecord(value) ? value : {}
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function asNumber(value: unknown): number | undefined {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : undefined
}

function buildQuestionMap(questions: KnowledgeQuestionRow[]) {
  return new Map(questions.map((question) => [question.question_code, question]))
}

function buildModuleMap(modules: KnowledgeModuleRow[]) {
  return new Map(
    modules
      .filter((module) => module.form_phase)
      .map((module) => [module.form_phase as string, module])
  )
}

function getModuleForQuestion(
  question: KnowledgeQuestionRow | undefined,
  moduleByPhase: Map<string, KnowledgeModuleRow>
) {
  if (!question?.form_phase) return undefined
  return moduleByPhase.get(question.form_phase)
}

function inferModuleFromQuestionType(questionType: string): KnowledgeModuleRow {
  if (questionType === 'pairing_choice') {
    return {
      module_code: 'FORM1',
      module_name: 'Estrutura de Harmonização',
      form_phase: 'form_1_pairing_structure',
    }
  }

  if (questionType === 'national_region') {
    return {
      module_code: 'FORM2',
      module_name: 'Identidade Nacional',
      form_phase: 'form_2_national_identity',
    }
  }

  if (questionType === 'qualitative_relationship') {
    return {
      module_code: 'FORM21',
      module_name: 'Relações Qualitativas',
      form_phase: 'form_2_1_qualitative_relationships',
    }
  }

  if (questionType === 'international_identity') {
    return {
      module_code: 'FORM3',
      module_name: 'Identidade Internacional',
      form_phase: 'form_3_international_identity',
    }
  }

  if (questionType === 'wine_aromatic_profile') {
    return {
      module_code: 'FORM4',
      module_name: 'Wine Aromatic Intelligence',
      form_phase: 'wine_aromatic_intelligence',
    }
  }

  if (questionType === 'dish_intelligence') {
    return {
      module_code: 'FORM5',
      module_name: 'Dish Intelligence',
      form_phase: 'dish_intelligence',
    }
  }

  return {
    module_code: 'unknown',
    module_name: undefined,
    form_phase: undefined,
  }
}

function resolveModuleForQuestion(
  questionType: string,
  question: KnowledgeQuestionRow | undefined,
  moduleByPhase: Map<string, KnowledgeModuleRow>
) {
  return getModuleForQuestion(question, moduleByPhase) ?? inferModuleFromQuestionType(questionType)
}

function inferQuestionType(
  answer: KnowledgeAnswerRow,
  json: Record<string, unknown>,
  question?: KnowledgeQuestionRow
) {
  return (
    question?.question_type ??
    asString(json.question_type) ??
    inferQuestionTypeFromCode(answer.question_code)
  )
}

function inferQuestionTypeFromCode(questionCode: string) {
  if (questionCode.includes('_AROMATIC_PROFILE')) return 'wine_aromatic_profile'
  if (questionCode.includes('_DISH_INTELLIGENCE')) return 'dish_intelligence'
  if (questionCode.includes('_PAIRING')) return 'pairing_choice'
  if (questionCode.includes('_NATIONAL_REGION')) return 'national_region'
  if (questionCode.includes('_INTERNATIONAL_IDENTITY')) return 'international_identity'
  if (questionCode.includes('_QUALITATIVE_RELATIONSHIP')) return 'qualitative_relationship'
  return 'unknown'
}

function getSubjectCode(
  questionType: string,
  questionCode: string,
  json: Record<string, unknown>,
  question?: KnowledgeQuestionRow
) {
  if (questionType === 'dish_intelligence' || questionType === 'pairing_choice') {
    return (
      asString(json.food_archetype_code) ??
      asString(json.archetype_code) ??
      question?.food_archetype_code ??
      questionCode.split('_')[0]
    )
  }

  return (
    asString(json.wine_profile_code) ??
    asString(json.source_profile_code) ??
    question?.wine_profile_code ??
    questionCode.split('_')[0]
  )
}

function getSubjectLabel(subjectCode?: string) {
  if (!subjectCode) return undefined

  if (subjectCode.startsWith('A')) {
    const archetype = getFoodArchetype(subjectCode)
    return archetype ? `${archetype.code} — ${archetype.title}` : subjectCode
  }

  if (subjectCode.startsWith('W')) {
    const profile = getWineProfile(subjectCode)
    return profile ? `${profile.code} — ${profile.title}` : subjectCode
  }

  return subjectCode
}

function normalizeAromaticValues(value: unknown) {
  if (!isRecord(value)) return {}

  return Object.fromEntries(
    Object.entries(value).map(([code, intensity]) => {
      const family = getAromaticFamily(code)

      return [
        code,
        {
          code,
          label: family?.name ?? code,
          intensity: asNumber(intensity) ?? 0,
        },
      ]
    })
  )
}

function normalizeDishValues(value: unknown) {
  if (!isRecord(value)) return {}

  return Object.fromEntries(
    Object.entries(value).map(([code, intensity]) => {
      const dimension = DISH_DIMENSIONS.find((item) => item.code === code)

      return [
        code,
        {
          code,
          label: dimension?.name ?? code,
          intensity: asNumber(intensity) ?? 0,
        },
      ]
    })
  )
}

function normalizeAnswerPayload(
  questionType: string,
  answer: KnowledgeAnswerRow,
  json: Record<string, unknown>,
  subjectCode?: string
): Record<string, unknown> {
  if (questionType === 'pairing_choice') {
    const wineProfileCode = asString(json.wine_profile_code) ?? answer.answer_text ?? undefined
    const wineProfile = wineProfileCode ? getWineProfile(wineProfileCode) : undefined

    return {
      foodArchetypeCode: subjectCode,
      foodArchetypeLabel: getSubjectLabel(subjectCode),
      wineProfileCode,
      wineProfileLabel: wineProfile ? `${wineProfile.code} — ${wineProfile.title}` : wineProfileCode,
      reason: asString(json.reason),
      descriptors: Array.isArray(json.descriptors) ? json.descriptors : [],
    }
  }

  if (questionType === 'national_region') {
    return {
      wineProfileCode: subjectCode,
      wineProfileLabel: getSubjectLabel(subjectCode),
      region: answer.answer_text ?? asString(json.value),
      reason: asString(json.reason),
    }
  }

  if (questionType === 'international_identity') {
    return {
      wineProfileCode: subjectCode,
      wineProfileLabel: getSubjectLabel(subjectCode),
      primaryRegionStyle: asString(json.primary_region_style),
      secondaryRegionStyles: Array.isArray(json.secondary_region_styles)
        ? json.secondary_region_styles
        : [],
      primaryGrape: asString(json.primary_grape),
      secondaryGrapes: Array.isArray(json.secondary_grapes) ? json.secondary_grapes : [],
      referenceWine: isRecord(json.reference_wine) ? json.reference_wine : undefined,
      descriptors: Array.isArray(json.wine_style_codes) ? json.wine_style_codes : [],
      reason: asString(json.reason),
    }
  }

  if (
    questionType === 'qualitative_relationship' ||
    questionType === 'similar_profile' ||
    questionType === 'relationship_profile'
  ) {
    const similarProfileCode = asString(json.similar_profile_code)

    return {
      sourceProfileCode: asString(json.source_profile_code) ?? subjectCode,
      sourceProfileLabel: getSubjectLabel(asString(json.source_profile_code) ?? subjectCode),
      similarProfileCode,
      similarProfileLabel: getSubjectLabel(similarProfileCode),
      similarityDegree: asString(json.similarity_degree),
      descriptors: Array.isArray(json.wine_style_codes) ? json.wine_style_codes : [],
      reason: asString(json.reason),
    }
  }

  if (questionType === 'wine_aromatic_profile') {
    return {
      wineProfileCode: subjectCode,
      wineProfileLabel: getSubjectLabel(subjectCode),
      aromaticValues: normalizeAromaticValues(json.aromatic_values),
      reason: asString(json.reason),
    }
  }

  if (questionType === 'dish_intelligence') {
    const archetypeCode = asString(json.archetype_code) ?? asString(json.food_archetype_code) ?? subjectCode

    return {
      dishName: asString(json.dish_name) ?? answer.answer_text ?? undefined,
      foodArchetypeCode: archetypeCode,
      foodArchetypeLabel: getSubjectLabel(archetypeCode),
      cookingMethod: asString(json.cooking_method),
      sensoryValues: normalizeDishValues(json.sensory_values),
      reason: asString(json.reason),
    }
  }

  return {
    value: answer.answer_text ?? asString(json.value),
    reason: asString(json.reason),
  }
}

function getStatus(confidenceScore: number, responseCount: number): KnowledgeExportStatus {
  const normalizedScore = confidenceScore > 1 ? confidenceScore / 100 : confidenceScore

  if (responseCount >= 3 && normalizedScore >= 0.75) return 'strong'
  if (responseCount >= 1 && normalizedScore >= 0.4) return 'usable'
  return 'draft'
}

function buildConsensusMetadata(
  item: KnowledgeConsensusRow,
  question?: KnowledgeQuestionRow,
  module?: KnowledgeModuleRow,
  subjectCode?: string
) {
  const subjectLabel = getSubjectLabel(subjectCode)

  return {
    formPhase: question?.form_phase ?? module?.form_phase,
    moduleCode: module?.module_code,
    moduleName: module?.module_name,
    questionText: question?.question_text,
    subjectCode,
    subjectLabel,
  }
}

function buildEmbeddingText(item: ConsensusKnowledgeExportItem) {
  const subject = item.subjectLabel ?? item.subjectCode ?? item.questionCode

  if (item.questionType === 'pairing_choice') {
    return `${subject} harmoniza com ${item.consensusValue}. Consenso baseado em ${item.responseCount} resposta(s), com ${Math.round(item.agreementRatio * 100)}% de acordo e score de confiança ${item.confidenceScore}.`
  }

  if (item.questionType === 'national_region') {
    return `${subject} está associado a ${item.consensusValue} no contexto da identidade vínica nacional. Consenso baseado em ${item.responseCount} resposta(s), com ${Math.round(item.agreementRatio * 100)}% de acordo e score de confiança ${item.confidenceScore}.`
  }

  if (item.questionType === 'international_identity') {
    return `${subject} tem identidade internacional próxima de ${item.consensusValue}. Consenso baseado em ${item.responseCount} resposta(s), com ${Math.round(item.agreementRatio * 100)}% de acordo e score de confiança ${item.confidenceScore}.`
  }

  if (item.questionType === 'qualitative_relationship') {
    return `${subject} tem relação qualitativa com ${item.consensusValue}. Consenso baseado em ${item.responseCount} resposta(s), com ${Math.round(item.agreementRatio * 100)}% de acordo e score de confiança ${item.confidenceScore}.`
  }

  if (item.questionType === 'wine_aromatic_profile') {
    return `${subject} tem perfil aromático consensual ${item.consensusValue}. Consenso baseado em ${item.responseCount} resposta(s), com ${Math.round(item.agreementRatio * 100)}% de acordo e score de confiança ${item.confidenceScore}.`
  }

  if (item.questionType === 'dish_intelligence') {
    return `${subject} está representado pelo prato ${item.consensusValue}. Consenso baseado em ${item.responseCount} resposta(s), com ${Math.round(item.agreementRatio * 100)}% de acordo e score de confiança ${item.confidenceScore}.`
  }

  return `${subject}: ${item.consensusValue}. Consenso baseado em ${item.responseCount} resposta(s), com ${Math.round(item.agreementRatio * 100)}% de acordo e score de confiança ${item.confidenceScore}.`
}

export function buildRawKnowledgeExportAnswers(
  answers: KnowledgeAnswerRow[],
  questions: KnowledgeQuestionRow[],
  modules: KnowledgeModuleRow[]
): RawKnowledgeExportAnswer[] {
  const questionByCode = buildQuestionMap(questions)
  const moduleByPhase = buildModuleMap(modules)

  return answers.map((answer, index) => {
    const json = parseJsonRecord(answer.answer_json)
    const question = questionByCode.get(answer.question_code)
    const questionType = inferQuestionType(answer, json, question)
    const module = resolveModuleForQuestion(questionType, question, moduleByPhase)
    const subjectCode = getSubjectCode(questionType, answer.question_code, json, question)

    return {
      answerId: answer.id ?? `${answer.question_code}-${index}`,
      sessionId: answer.session_id,
      expertId: answer.expert_id ?? 'unknown',
      moduleCode: module?.module_code ?? 'unknown',
      moduleName: module?.module_name ?? undefined,
      formPhase: question?.form_phase ?? module?.form_phase ?? undefined,
      questionCode: answer.question_code,
      questionType,
      questionText: answer.question_text ?? question?.question_text ?? undefined,
      subjectCode,
      subjectLabel: getSubjectLabel(subjectCode),
      answerValue: answer.answer_text ?? null,
      answerJson: json,
      normalized: normalizeAnswerPayload(questionType, answer, json, subjectCode),
      confidence: answer.confidence ?? null,
      createdAt: answer.created_at,
      updatedAt: answer.updated_at ?? undefined,
    }
  })
}

export function buildConsensusKnowledgeExportDataset(
  consensus: KnowledgeConsensusRow[],
  questions: KnowledgeQuestionRow[],
  modules: KnowledgeModuleRow[]
): ConsensusKnowledgeExportItem[] {
  const questionByCode = buildQuestionMap(questions)
  const moduleByPhase = buildModuleMap(modules)

  return consensus.map((item) => {
    const question = questionByCode.get(item.question_code)
    const module = resolveModuleForQuestion(item.question_type, question, moduleByPhase)
    const subjectCode = getSubjectCode(item.question_type, item.question_code, {}, question)
    const responseCount = Number(item.total_votes ?? 0)
    const winningVotes = Number(item.votes ?? 0)
    const agreementRatio = responseCount > 0 ? winningVotes / responseCount : 0
    const confidenceScore = Number(item.confidence_score ?? 0)

    return {
      knowledgeId: `${item.question_code}:${item.question_type}`,
      moduleCode: module?.module_code ?? 'unknown',
      moduleName: module?.module_name ?? undefined,
      formPhase: question?.form_phase ?? module?.form_phase ?? undefined,
      questionCode: item.question_code,
      questionType: item.question_type,
      subjectCode,
      subjectLabel: getSubjectLabel(subjectCode),
      consensusValue: item.winning_answer ?? '',
      responseCount,
      winningVotes,
      agreementRatio,
      confidenceScore,
      status: getStatus(confidenceScore, responseCount),
      updatedAt: item.updated_at ?? undefined,
      metadata: buildConsensusMetadata(item, question, module, subjectCode),
    }
  })
}

export function buildEmbeddingKnowledgeExportDataset(
  consensusDataset: ConsensusKnowledgeExportItem[]
): EmbeddingKnowledgeExportDocument[] {
  return consensusDataset.map((item) => ({
    id: `somas-knowledge:${item.knowledgeId}`,
    type: item.questionType,
    title: `${item.subjectLabel ?? item.questionCode} · ${item.questionType}`,
    text: buildEmbeddingText(item),
    metadata: {
      source: 'SomAS Knowledge Portal',
      sourceType: 'expert_consensus',
      moduleCode: item.moduleCode,
      moduleName: item.moduleName,
      formPhase: item.formPhase,
      questionCode: item.questionCode,
      questionType: item.questionType,
      subjectCode: item.subjectCode,
      subjectLabel: item.subjectLabel,
      responseCount: item.responseCount,
      winningVotes: item.winningVotes,
      agreementRatio: item.agreementRatio,
      confidenceScore: item.confidenceScore,
      status: item.status,
      updatedAt: item.updatedAt,
    },
  }))
}

export function toJsonDownload(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export function toJsonlDownload(rows: unknown[]) {
  return rows.map((row) => JSON.stringify(row)).join('\n')
}

export async function loadKnowledgeExportSourceData() {
  const [answersResult, questionsResult, modulesResult, consensusResult] =
    await Promise.all([
      supabase
        .from('knowledge_answers')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('knowledge_questions')
        .select('*')
        .eq('active', true)
        .order('priority'),
      supabase
        .from('knowledge_modules')
        .select('*')
        .order('sort_order'),
      supabase
        .from('knowledge_consensus')
        .select('*')
        .order('question_code'),
    ])

  if (answersResult.error) throw new Error(answersResult.error.message)
  if (questionsResult.error) throw new Error(questionsResult.error.message)
  if (modulesResult.error) throw new Error(modulesResult.error.message)
  if (consensusResult.error) throw new Error(consensusResult.error.message)

  return {
    answers: (answersResult.data ?? []) as KnowledgeAnswerRow[],
    questions: (questionsResult.data ?? []) as KnowledgeQuestionRow[],
    modules: (modulesResult.data ?? []) as KnowledgeModuleRow[],
    consensus: (consensusResult.data ?? []) as KnowledgeConsensusRow[],
  }
}

export async function buildKnowledgeExportBundle() {
  const source = await loadKnowledgeExportSourceData()

  const rawAnswers = buildRawKnowledgeExportAnswers(
    source.answers,
    source.questions,
    source.modules
  )

  const consensusDataset = buildConsensusKnowledgeExportDataset(
    source.consensus,
    source.questions,
    source.modules
  )

  const embeddingDataset = buildEmbeddingKnowledgeExportDataset(consensusDataset)

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'SomAS Knowledge Portal',
    rawAnswers,
    consensusDataset,
    embeddingDataset,
    metadata: {
      totalRawAnswers: rawAnswers.length,
      totalConsensusItems: consensusDataset.length,
      totalEmbeddingDocuments: embeddingDataset.length,
    },
  }
}
