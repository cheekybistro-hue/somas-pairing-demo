import { createFileRoute } from '@tanstack/react-router'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import KnowledgeRecommendationCard from '@/components/knowledge/KnowledgeRecommendationCard'
import KnowledgeConsensusCard from '@/components/knowledge/KnowledgeConsensusCard'
import KnowledgeStatsCard from '@/components/knowledge/KnowledgeStatsCard'
import KnowledgeProfileForm from '@/components/knowledge/KnowledgeProfileForm'
import DescriptorSelector from '@/components/knowledge/DescriptorSelector'
import KnowledgeModuleSelection from '@/components/knowledge/KnowledgeModuleSelection'
import KnowledgeInterviewPanel from '@/components/knowledge/KnowledgeInterviewPanel'
import { KnowledgeStoryCard } from '../components/knowledge/KnowledgeStoryCard'
import { getKnowledgeFormStory } from '../lib/knowledge/form-storytelling'
import { MyContributionsCard } from '../components/knowledge/MyContributionsCard'
import { ModuleReviewPage } from '../components/knowledge/ModuleReviewPage'
import type {
  KnowledgeModule,
  Progress,
  InternationalConsensus,
  ProfileConsensus,
  Question,
} from '@/lib/knowledge/knowledge-types'
import {
  loadModulesAndProgress,
  loadConsensusInsights,
  startKnowledgeModule,
  saveKnowledgeAnswer,
} from '@/lib/knowledge/knowledge-service'

import {
  Brain,
  User,
  Briefcase,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Wine,
  LogOut,
  BarChart3,
  Target,
  Activity,
} from 'lucide-react'
import { ReviewAnswersCard } from '../components/knowledge/ReviewAnswersCard'

export const Route = createFileRoute('/knowledge')({
  component: KnowledgeInterview,
})
type Stage = 'auth' | 'profile' | 'module' | 'interview' | 'done'
type AuthMode = 'login' | 'signup'

const roles = [
  'Sommelier',
  'Escanção',
  'Chef',
  'Enólogo',
  'Gastrónomo',
  'Produtor',
  'Distribuição',
  'Outro',
]

const experienceLevels = ['0 - 2 anos', '3 - 7 anos', '8 - 15 anos', '+15 anos']

const wineProfiles = [
  { code: 'W01', label: 'Branco leve, alta acidez, mineral' },
  { code: 'W02', label: 'Branco aromático floral' },
  { code: 'W03', label: 'Branco cítrico com textura média' },
  { code: 'W04', label: 'Branco estruturado sem madeira' },
  { code: 'W05', label: 'Branco com madeira integrada' },
  { code: 'W06', label: 'Branco de curtimenta' },
  { code: 'W07', label: 'Espumante bruto seco' },
  { code: 'W08', label: 'Espumante estruturado' },
  { code: 'W09', label: 'Espumante meio seco' },
  { code: 'W10', label: 'Rosé leve' },
  { code: 'W11', label: 'Rosé estruturado' },
  { code: 'W12', label: 'Tinto leve alta acidez' },
  { code: 'W13', label: 'Tinto médio fresco' },
  { code: 'W14', label: 'Tinto frutado' },
  { code: 'W15', label: 'Tinto vegetal/herbal' },
  { code: 'W16', label: 'Tinto elegante com madeira' },
  { code: 'W17', label: 'Tinto estruturado' },
  { code: 'W18', label: 'Tinto estruturado com madeira' },
  { code: 'W19', label: 'Tinto potente' },
  { code: 'W20', label: 'Tinto terroso' },
  { code: 'W21', label: 'Tinto elegante premium' },
  { code: 'W22', label: 'Tinto fumado' },
  { code: 'W23', label: 'Vinho de talha' },
  { code: 'W24', label: 'Branco doce' },
  { code: 'W25', label: 'Licoroso' },
  { code: 'W26', label: 'Porto Ruby' },
  { code: 'W27', label: 'Branco estilo Borgonha' },
  { code: 'W28', label: 'Tinto estilo Bordéus' },
  { code: 'W29', label: 'Tinto estilo Piemonte' },
  { code: 'W30', label: 'Branco estilo Riesling' },
]

const wineProfileGroups = [
  { title: 'Brancos', codes: ['W01', 'W02', 'W03', 'W04', 'W05', 'W06'] },
  { title: 'Espumantes', codes: ['W07', 'W08', 'W09'] },
  { title: 'Rosés', codes: ['W10', 'W11'] },
  { title: 'Tintos', codes: ['W12', 'W13', 'W14', 'W15', 'W16', 'W17', 'W18', 'W19', 'W20', 'W21', 'W22'] },
  { title: 'Especiais', codes: ['W23', 'W24', 'W25', 'W26'] },
  { title: 'Referências Internacionais', codes: ['W27', 'W28', 'W29', 'W30'] },
]



const internationalRegionStyles = [
  'Chablis - França',
  'White Burgundy - França',
  'Sancerre - França',
  'Loire Chenin - França',
  'Champagne - França',
  'Provence Rosé - França',
  'Beaujolais - França',
  'Burgundy Pinot Noir - França',
  'Bordeaux - França',
  'Northern Rhône Syrah - França',
  'Rioja - Espanha',
  'Barolo / Nebbiolo - Itália',
  'Chianti / Sangiovese - Itália',
  'Mosel Riesling - Alemanha',
  'Tokaji - Hungria',
  'Sauternes - França',
  'Sherry - Espanha',
  'Ruby Port wine style - Portugal',
  'Tawny Port wine style - Portugal',
  'Vintage Port wine style - Portugal',
  'White Port wine style - Portugal',
  'Orange wine - Geórgia / estilo global',
  'Natural wine - estilo global',
  'Napa Cabernet - USA',
  'Priorat - Espanha',
  'Etna Rosso - Itália',
  'Rías Baixas - Espanha',
  'Marlborough Sauvignon Blanc - Nova Zelândia',
  'Barossa Shiraz - Austrália',
  'Mendoza Malbec - Argentina',
  'Stellenbosch Cabernet - África do Sul',
  'Rías Baixas Albariño - Espanha',
  'Cava - Espanha',
  'Prosecco - Itália',
  'Outro',
]

const internationalRegionGroups = [
  { title: 'França', items: internationalRegionStyles.filter((item) => item.includes('França')) },
  { title: 'Espanha e Portugal', items: internationalRegionStyles.filter((item) => item.includes('Espanha') || item.includes('Portugal')) },
  { title: 'Itália', items: internationalRegionStyles.filter((item) => item.includes('Itália')) },
  { title: 'Europa Central e estilos globais', items: internationalRegionStyles.filter((item) => item.includes('Alemanha') || item.includes('Hungria') || item.includes('Geórgia') || item.includes('global')) },
  { title: 'Novo Mundo', items: internationalRegionStyles.filter((item) => item.includes('USA') || item.includes('Nova Zelândia') || item.includes('Austrália') || item.includes('Argentina') || item.includes('África do Sul')) },
  { title: 'Outro', items: ['Outro'] },
]

const internationalGrapes = [
  'Chardonnay',
  'Sauvignon Blanc',
  'Riesling',
  'Chenin Blanc',
  'Pinot Gris / Pinot Grigio',
  'Gewürztraminer',
  'Viognier',
  'Semillon',
  'Albariño',
  'Verdejo',
  'Garganega',
  'Assyrtiko',
  'Furmint',
  'Pinot Noir',
  'Cabernet Sauvignon',
  'Merlot',
  'Cabernet Franc',
  'Syrah / Shiraz',
  'Grenache / Garnacha',
  'Tempranillo',
  'Sangiovese',
  'Nebbiolo',
  'Barbera',
  'Malbec',
  'Zinfandel / Primitivo',
  'Gamay',
  'Mourvèdre / Monastrell',
  'Carignan',
  'Palomino',
  'Pedro Ximénez',
  'Muscat / Moscato',
  'Corvina',
  'Outra',
]

const internationalGrapeGroups = [
  { title: 'Brancas', items: internationalGrapes.slice(0, 13) },
  { title: 'Tintas', items: internationalGrapes.slice(13, 28) },
  { title: 'Fortificados / doces / especiais', items: internationalGrapes.slice(28) },
]

function isInternationalIdentityType(questionType: string) {
  return questionType === 'international_identity'
}

const similarityLevels = [
  'Muito semelhante',
  'Semelhante',
  'Parcialmente semelhante',
]


function isQualitativeRelationshipType(questionType: string) {
  return ['qualitative_relationship', 'similar_profile', 'relationship_profile'].includes(questionType)
}

const descriptorGroups = [
  {
    title: 'Frescura e Acidez',
    items: [
      { code: 'A', label: 'Alta acidez' },
      { code: 'B', label: 'Perfil mineral' },
      { code: 'C', label: 'Perfil salino / atlântico' },
      { code: 'Q', label: 'Alta frescura' },
    ],
  },
  {
    title: 'Fruta e Aromática',
    items: [
      { code: 'D', label: 'Fruta fresca' },
      { code: 'E', label: 'Fruta madura' },
      { code: 'J', label: 'Perfil floral' },
      { code: 'K', label: 'Perfil herbal / vegetal' },
      { code: 'L', label: 'Perfil especiado' },
    ],
  },
  {
    title: 'Estrutura',
    items: [
      { code: 'F', label: 'Estrutura média' },
      { code: 'G', label: 'Estrutura elevada' },
      { code: 'H', label: 'Tanino firme' },
      { code: 'I', label: 'Tanino macio' },
      { code: 'T', label: 'Perfil elegante / delicado / baixa extração' },
    ],
  },
  {
    title: 'Evolução e Enologia',
    items: [
      { code: 'M', label: 'Perfil tostado / madeira' },
      { code: 'N', label: 'Perfil fumado' },
      { code: 'O', label: 'Perfil oxidativo' },
      { code: 'R', label: 'Grande longevidade' },
      { code: 'S', label: 'Contacto com borras / batonnage' },
    ],
  },
  {
    title: 'Estilos Especiais',
    items: [
      { code: 'P', label: 'Perfil doce' },
      { code: 'U', label: 'Colheita tardia' },
      { code: 'V', label: 'Fortificado' },
      { code: 'W', label: 'Outro' },
    ],
  },
]

const portugueseRegions = [
  'Vinho Verde',
  'Trás-os-Montes',
  'Douro',
  'Távora-Varosa',
  'Dão',
  'Bairrada',
  'Beira Interior',
  'Lisboa',
  'Tejo',
  'Península de Setúbal',
  'Alentejo',
  'Algarve',
  'Madeira',
  'Açores',
  'Outro',
]

const portugueseGrapes = [
  'Alvarinho',
  'Arinto',
  'Encruzado',
  'Fernão Pires',
  'Loureiro',
  'Maria Gomes',
  'Rabigato',
  'Viosinho',
  'Baga',
  'Castelão',
  'Jaen',
  'Ramisco',
  'Tinta Roriz / Aragonez',
  'Touriga Franca',
  'Touriga Nacional',
  'Trincadeira',
  'Outro',
]

function KnowledgeInterview() {
  const [stage, setStage] = useState<Stage>('auth')
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [organization, setOrganization] = useState('')
  const [country, setCountry] = useState('Portugal')
  const [region, setRegion] = useState('')
  const [yearsExperience, setYearsExperience] = useState('')
  const [specialties, setSpecialties] = useState('')
  const [bio, setBio] = useState('')

  const [expertId, setExpertId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const [modules, setModules] = useState<KnowledgeModule[]>([])
  const [progress, setProgress] = useState<Record<string, Progress>>({})
  const [internationalConsensus, setInternationalConsensus] = useState<InternationalConsensus[]>([])
  const [profileConsensus, setProfileConsensus] = useState<ProfileConsensus[]>([])
  const [recentAnswers, setRecentAnswers] = useState<any[]>([])
  const [selectedModule, setSelectedModule] = useState<KnowledgeModule | null>(null)

  const [questions, setQuestions] = useState<Question[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedWine, setSelectedWine] = useState('')
  const [selectedValue, setSelectedValue] = useState('')
  const [secondaryRegionStyles, setSecondaryRegionStyles] = useState<string[]>([])
  const [primaryGrape, setPrimaryGrape] = useState('')
  const [secondaryGrapes, setSecondaryGrapes] = useState<string[]>([])
  const [referenceProducer, setReferenceProducer] = useState('')
  const [referenceLabel, setReferenceLabel] = useState('')
  const [referenceYear, setReferenceYear] = useState('')
  const [similarityDegree, setSimilarityDegree] = useState('')
  const [reason, setReason] = useState('')
  const [selectedDescriptors, setSelectedDescriptors] = useState<string[]>([])
  const [confidence, setConfidence] = useState(1)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentQuestion = questions.length > 0 ? questions[questionIndex] : null

  const currentProgress = selectedModule ? progress[selectedModule.form_phase] : null

  const contributionModules = modules.map((module) => {
    const moduleProgress = progress[module.form_phase]

    return {
      name: module.module_name,
      answered: moduleProgress?.questions_answered ?? 0,
      total:
      moduleProgress?.total_questions ??
      module.estimated_questions ??
      0,
    }
  })

  const [reviewModule, setReviewModule] =
  useState<KnowledgeModule | null>(null)

  const answeredInModule = currentProgress?.questions_answered ?? 0
  
  function getStoryPhaseForModule(module: KnowledgeModule | null) {
  if (!module) return null

  const code = module.module_code?.toUpperCase()
  const name = module.module_name?.toLowerCase() ?? ''
  const phase = module.form_phase?.toLowerCase() ?? ''

  if (code === 'FORM1' || phase.includes('pairing')) {
    return 'pairing'
  }

  if (
    code === 'FORM2' ||
    code === 'FORM3' ||
    code === 'FORM21' ||
    name.includes('identidade') ||
    name.includes('relações')
  ) {
    return 'wine_identity'
  }

  if (name.includes('aroma')) {
    return 'wine_aromatic'
  }

  if (name.includes('dish') || name.includes('prato')) {
    return 'dish_intelligence'
  }

  return null
}

  const storyPhase = getStoryPhaseForModule(selectedModule)
  const story = storyPhase ? getKnowledgeFormStory(storyPhase) : null
 
  
  useEffect(() => {
    initializeAuth()

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      if (!user) {
        resetUserState()
        return
      }

      setUserId(user.id)
      setUserEmail(user.email ?? null)
      setAuthEmail(user.email ?? '')
      setEmail(user.email ?? '')
      loadExpertForUser(user.id, user.email ?? '')
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  async function initializeAuth() {
    const { data } = await supabase.auth.getSession()
    const user = data.session?.user ?? null

    if (!user) {
      setStage('auth')
      return
    }

    setUserId(user.id)
    setUserEmail(user.email ?? null)
    setAuthEmail(user.email ?? '')
    setEmail(user.email ?? '')
    await loadExpertForUser(user.id, user.email ?? '')
  }

  function resetUserState() {
    setStage('auth')
    setUserId(null)
    setUserEmail(null)
    setExpertId(null)
    setSessionId(null)
    setModules([])
    setProgress({})
    setInternationalConsensus([])
    setProfileConsensus([])
    setSelectedModule(null)
    setQuestions([])
    setQuestionIndex(0)
  }

  async function handleAuth() {
    setLoading(true)
    setError(null)
    setAuthMessage('')

    const normalizedEmail = authEmail.trim().toLowerCase()

    if (!normalizedEmail || !authPassword) {
      setError('Indica email e password.')
      setLoading(false)
      return
    }

    if (authMode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: authPassword,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (!data.session) {
        setAuthMessage('Conta criada. Confirma o email antes de entrar.')
        setAuthMode('login')
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: authPassword,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function loadExpertForUser(uid: string, fallbackEmail: string) {
    setLoading(true)
    setError(null)

    const { data: expert, error: expertError } = await supabase
      .from('expert_profiles')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle()

    if (expertError) {
      setError(expertError.message)
      setLoading(false)
      return
    }

    if (!expert) {
      setEmail(fallbackEmail)
      setStage('profile')
      setLoading(false)
      return
    }

    setExpertId(expert.id)
    setName(expert.name ?? '')
    setDisplayName(expert.display_name ?? expert.name ?? '')
    setEmail(expert.email ?? fallbackEmail)
    setRole(expert.role ?? '')
    setOrganization(expert.organization ?? '')
    setCountry(expert.country ?? 'Portugal')
    setRegion(expert.region ?? '')
    setYearsExperience(expert.years_experience ?? '')
    setSpecialties(expert.specialties ?? '')
    setBio(expert.bio ?? '')

    await refreshKnowledgeData(expert.id)
    setStage('module')
    setLoading(false)
  }

 async function refreshKnowledgeData(activeExpertId: string) {
  try {
    const result = await loadModulesAndProgress(
      activeExpertId
    )

    setModules(result.modules)
    setProgress(result.progress)

    const consensus =
      await loadConsensusInsights()

    setInternationalConsensus(
      consensus.internationalConsensus
    )

    setProfileConsensus(
      consensus.profileConsensus
    )

    const {
      data: answersData,
      error: answersError,
    } = await supabase
      .from('knowledge_answers')
      .select('*')
      .eq('expert_id', activeExpertId)
      .order('created_at', {
        ascending: false,
      })
      .limit(20)

    if (answersError) {
      throw new Error(answersError.message)
    }

    setRecentAnswers(answersData ?? [])
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Erro ao carregar dados de conhecimento.'
    )
  }
}
const reviewAnswers =
  recentAnswers.map((answer) => ({
    id: answer.id,

    moduleName:
      answer.module_code ??
      'Knowledge',

    questionLabel:
      answer.question_code ??
      'Pergunta',

    answerSummary:
      answer.answer_value ??
      answer.answer_text ??
      'Resposta registada',

    confidence:
      answer.confidence ?? null,

    createdAt:
      answer.created_at ?? null,
  }))

  async function createExpertProfile() {
    if (!userId) return

    if (!name.trim()) {
      setError('Indica pelo menos o nome para começarmos.')
      return
    }

    setLoading(true)
    setError(null)

    const { data: expert, error: expertError } = await supabase
      .from('expert_profiles')
      .insert({
        user_id: userId,
        name: name.trim(),
        display_name: displayName.trim() || name.trim(),
        email: email.trim().toLowerCase() || userEmail,
        role: role || null,
        organization: organization.trim() || null,
        country: country.trim() || null,
        region: region.trim() || null,
        years_experience: yearsExperience || null,
        specialties: specialties.trim() || null,
        bio: bio.trim() || null,
      })
      .select('id')
      .single()

    if (expertError) {
      setError(expertError.message)
      setLoading(false)
      return
    }

    setExpertId(expert.id)
    await refreshKnowledgeData(expert.id)
    setStage('module')
    setLoading(false)
  }

  async function startModule(module: KnowledgeModule) {
    if (!expertId) return

    try {
      setLoading(true)
      setError(null)
      setSelectedModule(module)

      const result = await startKnowledgeModule(
        expertId,
        module,
        progress
      )

      setSessionId(result.sessionId)
      setQuestions(result.questions)
      setQuestionIndex(result.resumeIndex)

      clearAnswerState()
      setStage('interview')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao iniciar módulo'
      )
    } finally {
      setLoading(false)
    }
  }

  
function handleReviewModule(module: KnowledgeModule) {
  setReviewModule(module)
}
  
  
  function clearAnswerState() {
    setSelectedWine('')
    setSelectedValue('')
    setSimilarityDegree('')
    setSecondaryRegionStyles([])
    setPrimaryGrape('')
    setSecondaryGrapes([])
    setReferenceProducer('')
    setReferenceLabel('')
    setReferenceYear('')
    setSelectedDescriptors([])
    setReason('')
    setConfidence(1)
  }

  function getAnswerValue() {
    if (!currentQuestion) return ''

    if (currentQuestion.question_type === 'pairing_choice') {
      return selectedWine
    }

    if (isQualitativeRelationshipType(currentQuestion.question_type)) {
      if (!selectedWine || !similarityDegree) return ''
      return `${selectedWine} | ${similarityDegree}`
    }

    if (isInternationalIdentityType(currentQuestion.question_type)) {
      if (!selectedValue || !primaryGrape) return ''
      return `${selectedValue} | ${primaryGrape}`
    }

    return selectedValue.trim()
  }

  function getAnswerJson() {
    if (!currentQuestion) return {}

    const base = {
      question_type: currentQuestion.question_type,
      food_archetype_code: currentQuestion.food_archetype_code,
      wine_profile_code: currentQuestion.wine_profile_code,
      descriptors: selectedDescriptors,
      reason,
      confidence,
    }

    if (currentQuestion.question_type === 'pairing_choice') {
      return {
        ...base,
        wine_profile_code: selectedWine,
      }
    }

    if (isQualitativeRelationshipType(currentQuestion.question_type)) {
      return {
        ...base,
        source_profile_code: currentQuestion.wine_profile_code,
        similar_profile_code: selectedWine,
        similarity_degree: similarityDegree,
        wine_style_codes: selectedDescriptors,
      }
    }

    if (isInternationalIdentityType(currentQuestion.question_type)) {
      return {
        ...base,
        primary_region_style: selectedValue,
        secondary_region_styles: secondaryRegionStyles,
        primary_grape: primaryGrape,
        secondary_grapes: secondaryGrapes,
        wine_style_codes: selectedDescriptors,
        reference_wine: {
          producer: referenceProducer.trim(),
          label: referenceLabel.trim(),
          year: referenceYear.trim(),
        },
      }
    }

    return {
      ...base,
      value: selectedValue.trim(),
    }
  }

  async function saveAnswer() {
    if (!expertId || !sessionId || !currentQuestion || !selectedModule) return

    const answerValue = getAnswerValue()

    if (!answerValue) {
      setError('Seleciona ou escreve uma resposta.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const answerJson = getAnswerJson()

      const result = await saveKnowledgeAnswer({
        expertId,
        sessionId,
        selectedModule,
        currentQuestion,
        questions,
        questionIndex,
        answeredInModule,
        answerValue,
        answerJson,
        confidence,
      })

      setProgress((current) => ({
        ...current,
        [selectedModule.form_phase]: result.progress,
      }))

      if (result.isComplete) {
        setStage('done')
        return
      }

      setQuestionIndex(questionIndex + 1)
      clearAnswerState()
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao guardar resposta'
      )
    } finally {
      setLoading(false)
    }
  }

  function backToModules() {
    setStage('module')
    setSelectedModule(null)
    setQuestions([])
    setQuestionIndex(0)
    clearAnswerState()
    if (expertId) refreshKnowledgeData(expertId)
  }

  const moduleCards = useMemo(() => modules, [modules])

  const dashboardStats = useMemo(() => {
    const totalQuestions = modules.reduce((sum, module) => sum + (module.estimated_questions || 0), 0)
    const totalAnswered = modules.reduce((sum, module) => {
      const answered = progress[module.form_phase]?.questions_answered ?? 0
      return sum + Math.min(answered, module.estimated_questions || answered)
    }, 0)
    const percent = totalQuestions > 0 ? Math.min(Math.round((totalAnswered / totalQuestions) * 100), 100) : 0
    const modulesStarted = modules.filter((module) => (progress[module.form_phase]?.questions_answered ?? 0) > 0).length
    const modulesCompleted = modules.filter((module) => progress[module.form_phase]?.status === 'completed').length
    const lastUpdated = Object.values(progress)
      .map((item) => item.updated_at || item.completed_at)
      .filter(Boolean)
      .sort()
      .at(-1)

    return {
      totalQuestions,
      totalAnswered,
      percent,
      modulesStarted,
      modulesCompleted,
      lastUpdated,
    }
  }, [modules, progress])

  const nextRecommendation = useMemo(() => {
    const incompleteModules = modules
      .map((module) => {
        const answered = progress[module.form_phase]?.questions_answered ?? 0
        const total = module.estimated_questions || 0
        const percent = total > 0 ? answered / total : 1
        return { module, answered, total, percent }
      })
      .filter((item) => item.total > 0 && item.answered < item.total)
      .sort((a, b) => a.percent - b.percent)

    const next = incompleteModules[0]

    if (!next) {
      return {
        title: 'Base concluída',
        text: 'Todos os módulos principais estão completos. O próximo passo será analisar consenso e aromas.',
        module: null as KnowledgeModule | null,
      }
    }

    return {
      title: `Continuar ${next.module.module_code}`,
      text: `${next.module.module_name}: ${next.answered} / ${next.total} respostas. Este é o módulo onde a tua contribuição agora gera mais valor.`,
      module: next.module,
    }
  }, [modules, progress])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
     
      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="text-center mb-10 relative">
          {userId && (
            <button
              type="button"
              onClick={signOut}
              className="absolute right-0 top-0 text-sm text-zinc-400 hover:text-amber-400 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          )}

          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight">
              SomAS <span className="font-semibold text-amber-400">Knowledge Interview</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-lg">Cada resposta ajuda a construir o motor de decisão SomAS.</p>
          {userEmail && <p className="text-zinc-500 text-sm mt-2">Sessão: {userEmail}</p>}
        </header>

        {stage === 'auth' && (
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-light mb-2">Entrar no SomAS Knowledge</h2>
            <p className="text-zinc-400 mb-8">
              Usa email e password para manter o teu progresso e respostas unificados.
            </p>

            <div className="space-y-5">
              <Field label="Email" icon={<User className="w-4 h-4" />}>
                <input value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="input" type="email" />
              </Field>

              <Field label="Password" icon={<Sparkles className="w-4 h-4" />}>
                <input value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="input" type="password" />
              </Field>
            </div>

            {authMessage && <div className="mt-6 bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-4 text-emerald-300 text-sm">{authMessage}</div>}
            {error && <ErrorBox message={error} />}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-between">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-sm text-zinc-400 hover:text-amber-400"
              >
                {authMode === 'login' ? 'Criar conta nova' : 'Já tenho conta'}
              </button>

              <button onClick={handleAuth} disabled={loading} className="btn-primary">
                {loading ? 'A processar…' : authMode === 'login' ? 'Entrar' : 'Criar conta'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

{stage === 'profile' && (
  <KnowledgeProfileForm
    name={name}
    displayName={displayName}
    email={email}
    role={role}
    organization={organization}
    yearsExperience={yearsExperience}
    country={country}
    region={region}
    specialties={specialties}
    bio={bio}
    roles={roles}
    experienceLevels={experienceLevels}
    error={error}
    loading={loading}
    onNameChange={setName}
    onDisplayNameChange={setDisplayName}
    onEmailChange={setEmail}
    onRoleChange={setRole}
    onOrganizationChange={setOrganization}
    onYearsExperienceChange={setYearsExperience}
    onCountryChange={setCountry}
    onRegionChange={setRegion}
    onSpecialtiesChange={setSpecialties}
    onBioChange={setBio}
    onSubmit={createExpertProfile}
  />
)}

        {stage === 'module' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Dashboard do especialista</p>
                  <h2 className="text-3xl font-light">Olá {displayName || name || 'especialista'} 👋</h2>
                  <p className="text-zinc-400 mt-2">O teu conhecimento está a alimentar o motor de decisão SomAS.</p>
                </div>
                <div className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-4 min-w-[220px]">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Perfil</div>
                  <div className="font-semibold">{role || 'Especialista'}</div>
                  <div className="text-sm text-zinc-400 mt-1">{email || userEmail}</div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <KnowledgeStatsCard
                  icon={<BarChart3 className="w-5 h-5" />}
                  label="Conhecimento contribuído"
                  value={`${dashboardStats.totalAnswered} / ${dashboardStats.totalQuestions}`}
                  helper={`${dashboardStats.percent}% concluído`}
                />
                <KnowledgeStatsCard
                  icon={<Target className="w-5 h-5" />}
                  label="Módulos"
                  value={`${dashboardStats.modulesCompleted} completos`}
                  helper={`${dashboardStats.modulesStarted} iniciados`}
                />
                <KnowledgeStatsCard
                  icon={<Activity className="w-5 h-5" />}
                  label="Última atividade"
                  value={dashboardStats.lastUpdated ? 'Registada' : 'Sem atividade'}
                  helper={dashboardStats.lastUpdated ? new Date(dashboardStats.lastUpdated).toLocaleString('pt-PT') : 'Começa por um módulo'}
                />
              </div>

              <div className="mt-6">
                <div className="h-3 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                  <div className="h-full bg-amber-400" style={{ width: `${dashboardStats.percent}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-zinc-500">
                  <span>Progresso global</span>
                  <span>{dashboardStats.percent}%</span>
                </div>
              </div>
            </div>

            <MyContributionsCard modules={contributionModules} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <KnowledgeConsensusCard
  internationalConsensus={internationalConsensus.map((item) => ({
    label: `${item.wine_profile_code} → ${item.region_style}`,
    value: item.region_style,
    votes: item.votes,
  }))}
  profileConsensus={profileConsensus.map((item) => ({
    label: `${item.source_profile} → ${item.target_profile}`,
    value: item.target_profile,
    votes: item.votes,
  }))}
/>

<KnowledgeRecommendationCard
  recommendation={nextRecommendation}
  onContinue={startModule}
/>
            </div>

<KnowledgeModuleSelection
  moduleCards={moduleCards}
  progress={progress}
  onStart={startModule}
  onReview={handleReviewModule}
/>
{reviewModule && expertId && (
  <ModuleReviewPage
    expertId={expertId}
    formPhase={reviewModule.form_phase}
    moduleName={reviewModule.module_name}
    onBack={() =>
      setReviewModule(null)
    }
    onContinue={() => {
      setReviewModule(null)
      startModule(reviewModule)
    }}
  />
)}
            

          </div>
        )}
{stage === 'interview' && selectedModule && currentQuestion && (
  <div className="space-y-6">
    {story && (
      <KnowledgeStoryCard
        title={story.title}
        subtitle={story.subtitle}
        whyItMatters={story.whyItMatters}
        howToAnswer={story.howToAnswer}
        somasImpact={story.somasImpact}
      />
    )}

    <KnowledgeInterviewPanel
    selectedModule={selectedModule}
    currentQuestion={currentQuestion}
    questionIndex={questionIndex}
    questions={questions}

    selectedWine={selectedWine}
    setSelectedWine={setSelectedWine}

    selectedValue={selectedValue}
    setSelectedValue={setSelectedValue}

    similarityDegree={similarityDegree}
    setSimilarityDegree={setSimilarityDegree}

    secondaryRegionStyles={secondaryRegionStyles}
    setSecondaryRegionStyles={setSecondaryRegionStyles}

    primaryGrape={primaryGrape}
    setPrimaryGrape={setPrimaryGrape}

    secondaryGrapes={secondaryGrapes}
    setSecondaryGrapes={setSecondaryGrapes}

    referenceProducer={referenceProducer}
    setReferenceProducer={setReferenceProducer}

    referenceLabel={referenceLabel}
    setReferenceLabel={setReferenceLabel}

    referenceYear={referenceYear}
    setReferenceYear={setReferenceYear}

    selectedDescriptors={selectedDescriptors}
    setSelectedDescriptors={setSelectedDescriptors}

    reason={reason}
    setReason={setReason}

    confidence={confidence}
    setConfidence={setConfidence}

    answeredInModule={answeredInModule}
    loading={loading}
    error={error}

    saveAnswer={saveAnswer}
    backToModules={backToModules}

    QuestionInput={QuestionInput}
    Field={Field}
    ErrorBox={ErrorBox}

      isQualitativeRelationshipType={isQualitativeRelationshipType}
      isInternationalIdentityType={isInternationalIdentityType}
    />
  </div>
)}
        
        {stage === 'done' && (
          <div className="bg-zinc-800/50 border border-amber-400/30 rounded-2xl p-8 max-w-3xl mx-auto text-center">
            <CheckCircle className="w-14 h-14 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-light mb-3">Módulo concluído</h2>
            <p className="text-zinc-400 mb-8">Obrigado. As respostas foram guardadas e já fazem parte da camada de conhecimento SomAS.</p>
            <button onClick={backToModules} className="btn-primary mx-auto">Voltar aos módulos <ArrowRight className="w-5 h-5" /></button>
          </div>
        )}
      </div>
    </div>
  )
}

function QuestionInput({
  question,
  selectedWine,
  setSelectedWine,
  selectedValue,
  setSelectedValue,
  similarityDegree,
  setSimilarityDegree,
  secondaryRegionStyles,
  setSecondaryRegionStyles,
  primaryGrape,
  setPrimaryGrape,
  secondaryGrapes,
  setSecondaryGrapes,
  referenceProducer,
  setReferenceProducer,
  referenceLabel,
  setReferenceLabel,
  referenceYear,
  setReferenceYear,
}: {
  question: Question
  selectedWine: string
  setSelectedWine: (value: string) => void
  selectedValue: string
  setSelectedValue: (value: string) => void
  similarityDegree: string
  setSimilarityDegree: (value: string) => void
  secondaryRegionStyles: string[]
  setSecondaryRegionStyles: React.Dispatch<React.SetStateAction<string[]>>
  primaryGrape: string
  setPrimaryGrape: (value: string) => void
  secondaryGrapes: string[]
  setSecondaryGrapes: React.Dispatch<React.SetStateAction<string[]>>
  referenceProducer: string
  setReferenceProducer: (value: string) => void
  referenceLabel: string
  setReferenceLabel: (value: string) => void
  referenceYear: string
  setReferenceYear: (value: string) => void
}) {
  if (question.question_type === 'pairing_choice') {
    return (
      <div className="mb-8">
        {wineProfileGroups.map((group) => {
          const profiles = wineProfiles.filter((wine) => group.codes.includes(wine.code))

          return (
            <div key={group.title} className="mb-8">
              <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-3">{group.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profiles.map((wine) => (
                  <ChoiceButton key={wine.code} selected={selectedWine === wine.code} onClick={() => setSelectedWine(wine.code)}>
                    <div className="flex gap-2 items-center mb-1">
                      <Wine className="w-4 h-4 text-amber-400" />
                      <span className="font-mono text-amber-400">{wine.code}</span>
                    </div>
                    <div className="text-sm text-zinc-300">{wine.label}</div>
                  </ChoiceButton>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (isQualitativeRelationshipType(question.question_type)) {
    return (
      <div className="mb-8">
        <Field label="Perfil vínico mais semelhante" icon={<Wine className="w-4 h-4" />}>
          <div className="space-y-8 mb-8">
            {wineProfileGroups.map((group) => {
              const profiles = wineProfiles
                .filter((wine) => group.codes.includes(wine.code))
                .filter((wine) => wine.code !== question.wine_profile_code)

              if (profiles.length === 0) return null

              return (
                <div key={group.title}>
                  <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-3">
                    {group.title}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {profiles.map((wine) => (
                      <ChoiceButton
                        key={wine.code}
                        selected={selectedWine === wine.code}
                        onClick={() => setSelectedWine(wine.code)}
                      >
                        <div className="flex gap-2 items-center mb-1">
                          <Wine className="w-4 h-4 text-amber-400" />
                          <span className="font-mono text-amber-400">{wine.code}</span>
                        </div>
                        <div className="text-sm text-zinc-300">{wine.label}</div>
                      </ChoiceButton>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Field>

        <Field label="Grau de semelhança" icon={<Sparkles className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {similarityLevels.map((level) => (
              <ChoiceButton
                key={level}
                selected={similarityDegree === level}
                onClick={() => setSimilarityDegree(level)}
              >
                {level}
              </ChoiceButton>
            ))}
          </div>
        </Field>
      </div>
    )
  }

  if (isInternationalIdentityType(question.question_type)) {
    return (
      <div className="mb-8 space-y-10">
        <Field label="Correspondência internacional principal" icon={<MapPin className="w-4 h-4" />}>
          <p className="text-sm text-zinc-500 mb-4">Escolhe a referência internacional que melhor representa este perfil.</p>
          <div className="space-y-8 mb-8">
            {internationalRegionGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-3">{group.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.items.map((item) => (
                    <ChoiceButton key={item} selected={selectedValue === item} onClick={() => {
                      setSelectedValue(item)
                      setSecondaryRegionStyles((current) => current.filter((value) => value !== item))
                    }}>
                      {item}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Field>

        <MultiChoiceLimited
          label="Correspondências internacionais secundárias"
          helper="Opcional. Podes escolher até 2 alternativas relevantes."
          groups={internationalRegionGroups}
          selected={secondaryRegionStyles}
          setSelected={setSecondaryRegionStyles}
          max={2}
          exclude={selectedValue ? [selectedValue] : []}
        />

        <Field label="Uva internacional principal" icon={<Sparkles className="w-4 h-4" />}>
          <p className="text-sm text-zinc-500 mb-4">Escolhe a uva que melhor representa esta correspondência.</p>
          <div className="space-y-8 mb-8">
            {internationalGrapeGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-3">{group.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.items.map((item) => (
                    <ChoiceButton key={item} selected={primaryGrape === item} onClick={() => {
                      setPrimaryGrape(item)
                      setSecondaryGrapes((current) => current.filter((value) => value !== item))
                    }}>
                      {item}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Field>

        <MultiChoiceLimited
          label="Uvas internacionais secundárias"
          helper="Opcional. Podes escolher até 2 uvas secundárias."
          groups={internationalGrapeGroups}
          selected={secondaryGrapes}
          setSelected={setSecondaryGrapes}
          max={2}
          exclude={primaryGrape ? [primaryGrape] : []}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Produtor opcional" icon={<Wine className="w-4 h-4" />}>
            <input value={referenceProducer} onChange={(e) => setReferenceProducer(e.target.value)} className="input" placeholder="Ex: Raveneau" />
          </Field>
          <Field label="Rótulo / vinho opcional" icon={<Wine className="w-4 h-4" />}>
            <input value={referenceLabel} onChange={(e) => setReferenceLabel(e.target.value)} className="input" placeholder="Ex: Chablis Premier Cru" />
          </Field>
          <Field label="Ano opcional" icon={<Wine className="w-4 h-4" />}>
            <input value={referenceYear} onChange={(e) => setReferenceYear(e.target.value)} className="input" placeholder="Ex: 2020" />
          </Field>
        </div>
      </div>
    )
  }

  if (question.question_type === 'national_region') {
    return (
      <Field label="Região portuguesa" icon={<MapPin className="w-4 h-4" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {portugueseRegions.map((item) => (
            <ChoiceButton key={item} selected={selectedValue === item} onClick={() => setSelectedValue(item)}>
              {item}
            </ChoiceButton>
          ))}
        </div>
      </Field>
    )
  }

  if (question.question_type === 'national_grape') {
    return (
      <Field label="Casta portuguesa" icon={<Sparkles className="w-4 h-4" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {portugueseGrapes.map((item) => (
            <ChoiceButton key={item} selected={selectedValue === item} onClick={() => setSelectedValue(item)}>
              {item}
            </ChoiceButton>
          ))}
        </div>
      </Field>
    )
  }

  return (
    <div className="mb-8">
      <Field label="Resposta" icon={<Sparkles className="w-4 h-4" />}>
        <input value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} className="input" placeholder="Ex: produtor, rótulo ou vinho de referência..." />
      </Field>
    </div>
  )
}

function MultiChoiceLimited({
  label,
  helper,
  groups,
  selected,
  setSelected,
  max,
  exclude = [],
}: {
  label: string
  helper?: string
  groups: { title: string; items: string[] }[]
  selected: string[]
  setSelected: React.Dispatch<React.SetStateAction<string[]>>
  max: number
  exclude?: string[]
}) {
  return (
    <Field label={label} icon={<Sparkles className="w-4 h-4" />}>
      {helper && <p className="text-sm text-zinc-500 mb-4">{helper}</p>}
      <div className="space-y-8">
        {groups.map((group) => {
          const items = group.items.filter((item) => !exclude.includes(item))
          if (items.length === 0) return null

          return (
            <div key={group.title}>
              <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-3">{group.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item) => {
                  const isSelected = selected.includes(item)
                  const disabled = !isSelected && selected.length >= max

                  return (
                    <button
                      key={item}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        setSelected((current) =>
                          current.includes(item)
                            ? current.filter((value) => value !== item)
                            : current.length >= max
                              ? current
                              : [...current, item]
                        )
                      }}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/10'
                          : disabled
                            ? 'border-zinc-800 bg-zinc-900/20 opacity-40 cursor-not-allowed'
                            : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500'
                      }`}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </Field>
  )
}



function ChoiceButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-xl border transition-all ${
        selected ? 'border-amber-400 bg-amber-400/10' : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500'
      }`}
    >
      {children}
    </button>
  )
}

function Field({
  label,
  icon,
  children,
}: {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2 uppercase tracking-widest">
        <span className="text-zinc-500">{icon}</span>
        {label}
      </div>
      {children}
    </label>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-6 bg-red-950/40 border border-red-800/50 rounded-xl p-4 text-red-300 text-sm">
      {message}
    </div>
  )
}
