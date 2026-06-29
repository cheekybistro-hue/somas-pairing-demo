import { supabase } from '../supabase'

export type KnowledgePassportSource =
  | 'knowledge-portal'

export type KnowledgePassport = {
  id: string
  version: string
  schemaVersion: 1
  knowledgeVersion: string
  createdAt: string
  source: KnowledgePassportSource
  answers: unknown[]
  experts: unknown[]
  modules: unknown[]
  questions: unknown[]
  progress: unknown[]
  metadata: {
    totalAnswers: number
    totalExperts: number
    totalModules: number
    totalQuestions: number
    totalProgress: number
    generatedBy: string
  }
}

async function loadTable(
  tableName: string
): Promise<unknown[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function buildKnowledgePassport(): Promise<KnowledgePassport> {
  const [
    answers,
    experts,
    modules,
    questions,
    progress,
  ] = await Promise.all([
    loadTable('knowledge_answers'),
    loadTable('expert_profiles'),
    loadTable('knowledge_modules'),
    loadTable('knowledge_questions'),
    loadTable('knowledge_progress'),
  ])

  const createdAt = new Date().toISOString()

  return {
    id: `knowledge-passport-${Date.now()}`,
    version: '1.0.0',
    schemaVersion: 1,
    knowledgeVersion: createdAt,
    createdAt,
    source: 'knowledge-portal',
    answers,
    experts,
    modules,
    questions,
    progress,
    metadata: {
      totalAnswers: answers.length,
      totalExperts: experts.length,
      totalModules: modules.length,
      totalQuestions: questions.length,
      totalProgress: progress.length,
      generatedBy: 'SomAS Knowledge Portal',
    },
  }
}
