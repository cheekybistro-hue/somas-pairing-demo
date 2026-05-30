import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
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
} from 'lucide-react'

export const Route = createFileRoute('/knowledge')({
  component: KnowledgeInterview,
})

type Stage = 'auth' | 'profile' | 'module' | 'interview' | 'done'
type AuthMode = 'login' | 'signup'

type KnowledgeModule = {
  module_code: string
  module_name: string
  description: string | null
  form_phase: string
  sort_order: number
  estimated_questions: number
  active: boolean
}

type Progress = {
  form_phase: string
  status: string
  questions_answered: number
  completed_at: string | null
}

type Question = {
  question_code: string
  form_phase: string
  question_type: string
  food_archetype_code: string | null
  wine_profile_code: string | null
  question_text: string
  helper_text: string | null
  priority: number
}

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
]

const wineProfileGroups = [
  { title: 'Brancos', codes: ['W01', 'W02', 'W03', 'W04', 'W05', 'W06'] },
  { title: 'Espumantes', codes: ['W07', 'W08', 'W09'] },
  { title: 'Rosés', codes: ['W10', 'W11'] },
  { title: 'Tintos', codes: ['W12', 'W13', 'W14', 'W15', 'W16', 'W17', 'W18', 'W19', 'W20'] },
]

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
  const [selectedModule, setSelectedModule] = useState<KnowledgeModule | null>(null)

  const [questions, setQuestions] = useState<Question[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedWine, setSelectedWine] = useState('')
  const [selectedValue, setSelectedValue] = useState('')
  const [reason, setReason] = useState('')
  const [selectedDescriptors, setSelectedDescriptors] = useState<string[]>([])
  const [confidence, setConfidence] = useState(1)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentQuestion = questions.length > 0 ? questions[questionIndex] : null

  const currentProgress = selectedModule ? progress[selectedModule.form_phase] : null
  const answeredInModule = currentProgress?.questions_answered ?? 0

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

    await loadModulesAndProgress(expert.id)
    setStage('module')
    setLoading(false)
  }

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
    await loadModulesAndProgress(expert.id)
    setStage('module')
    setLoading(false)
  }

  async function loadModulesAndProgress(activeExpertId: string) {
    const { data: moduleData, error: moduleError } = await supabase
      .from('knowledge_modules')
      .select('*')
      .eq('active', true)
      .order('sort_order')

    if (moduleError) {
      setError(moduleError.message)
      return
    }

    const { data: progressData, error: progressError } = await supabase
      .from('expert_module_progress')
      .select('*')
      .eq('expert_id', activeExpertId)

    if (progressError) {
      setError(progressError.message)
      return
    }

    const progressMap: Record<string, Progress> = {}
    ;(progressData ?? []).forEach((item: Progress) => {
      progressMap[item.form_phase] = item
    })

    setModules(moduleData ?? [])
    setProgress(progressMap)
  }

  async function startModule(module: KnowledgeModule) {
    if (!expertId) return

    setLoading(true)
    setError(null)
    setSelectedModule(module)

    const { data: loadedQuestions, error: questionsError } = await supabase
      .from('knowledge_questions')
      .select('*')
      .eq('active', true)
      .eq('form_phase', module.form_phase)
      .order('priority')

    if (questionsError) {
      setError(questionsError.message)
      setLoading(false)
      return
    }

    const moduleQuestions = (loadedQuestions ?? []) as Question[]
    const existingProgress = progress[module.form_phase]
    const resumeIndex = Math.min(existingProgress?.questions_answered ?? 0, Math.max(moduleQuestions.length - 1, 0))

    const { data: session, error: sessionError } = await supabase
      .from('knowledge_sessions')
      .insert({
        expert_id: expertId,
        status: 'started',
      })
      .select('id')
      .single()

    if (sessionError) {
      setError(sessionError.message)
      setLoading(false)
      return
    }

    await supabase.from('expert_module_progress').upsert(
      {
        expert_id: expertId,
        form_phase: module.form_phase,
        status: existingProgress?.status === 'completed' ? 'completed' : 'in_progress',
        questions_answered: existingProgress?.questions_answered ?? 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'expert_id,form_phase' }
    )

    await supabase.from('interview_messages').insert({
      session_id: session.id,
      expert_id: expertId,
      role: 'assistant',
      form_phase: module.form_phase,
      knowledge_target: module.module_code,
      message: `Início do módulo ${module.module_name}.`,
    })

    setSessionId(session.id)
    setQuestions(moduleQuestions)
    setQuestionIndex(resumeIndex)
    clearAnswerState()
    setStage('interview')
    setLoading(false)
  }

  function clearAnswerState() {
    setSelectedWine('')
    setSelectedValue('')
    setSelectedDescriptors([])
    setReason('')
    setConfidence(1)
  }

  function getAnswerValue() {
    if (!currentQuestion) return ''
    if (currentQuestion.question_type === 'pairing_choice') return selectedWine
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

    setLoading(true)
    setError(null)

    const answerJson = getAnswerJson()

    const { error: insertError } = await supabase.from('knowledge_answers').insert({
      session_id: sessionId,
      expert_id: expertId,
      question_code: currentQuestion.question_code,
      question_text: currentQuestion.question_text,
      answer_text: answerValue,
      answer_json: answerJson,
      confidence,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    await supabase.from('interview_messages').insert({
      session_id: sessionId,
      expert_id: expertId,
      role: 'expert',
      form_phase: currentQuestion.form_phase,
      knowledge_target: currentQuestion.question_type,
      message: JSON.stringify(answerJson),
    })

    const newCount = Math.max(answeredInModule + 1, questionIndex + 1)
    const isComplete = newCount >= questions.length

    await supabase.from('knowledge_sessions').update({
      status: isComplete ? 'completed' : 'started',
      questions_answered: newCount,
      knowledge_points_generated: newCount,
      completed_at: isComplete ? new Date().toISOString() : null,
    }).eq('id', sessionId)

    await supabase.from('expert_module_progress').upsert(
      {
        expert_id: expertId,
        form_phase: selectedModule.form_phase,
        status: isComplete ? 'completed' : 'in_progress',
        questions_answered: newCount,
        completed_at: isComplete ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'expert_id,form_phase' }
    )

    setProgress((current) => ({
      ...current,
      [selectedModule.form_phase]: {
        form_phase: selectedModule.form_phase,
        status: isComplete ? 'completed' : 'in_progress',
        questions_answered: newCount,
        completed_at: isComplete ? new Date().toISOString() : null,
      },
    }))

    if (isComplete) {
      setStage('done')
    } else {
      const nextQuestion = questions[questionIndex + 1]

      if (nextQuestion) {
        await supabase.from('interview_messages').insert({
          session_id: sessionId,
          expert_id: expertId,
          role: 'assistant',
          form_phase: nextQuestion.form_phase,
          knowledge_target: nextQuestion.question_type,
          message: nextQuestion.question_text,
        })
      }

      setQuestionIndex(questionIndex + 1)
      clearAnswerState()
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }

    setLoading(false)
  }

  function backToModules() {
    setStage('module')
    setSelectedModule(null)
    setQuestions([])
    setQuestionIndex(0)
    clearAnswerState()
    if (expertId) loadModulesAndProgress(expertId)
  }

  const moduleCards = useMemo(() => modules, [modules])

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
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-2">Completar perfil</h2>
            <p className="text-zinc-400 mb-8">Estes dados ajudam a criar a tua persona de conhecimento.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nome *" icon={<User className="w-4 h-4" />}><input value={name} onChange={(e) => setName(e.target.value)} className="input" /></Field>
              <Field label="Nome público" icon={<Sparkles className="w-4 h-4" />}><input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input" /></Field>
              <Field label="Email" icon={<User className="w-4 h-4" />}><input value={email} onChange={(e) => setEmail(e.target.value)} className="input" type="email" /></Field>
              <Field label="Função" icon={<Briefcase className="w-4 h-4" />}>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
                  <option value="">Selecionar…</option>
                  {roles.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Organização" icon={<Briefcase className="w-4 h-4" />}><input value={organization} onChange={(e) => setOrganization(e.target.value)} className="input" /></Field>
              <Field label="Experiência" icon={<Sparkles className="w-4 h-4" />}>
                <select value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} className="input">
                  <option value="">Selecionar…</option>
                  {experienceLevels.map((e) => <option key={e}>{e}</option>)}
                </select>
              </Field>
              <Field label="País" icon={<MapPin className="w-4 h-4" />}><input value={country} onChange={(e) => setCountry(e.target.value)} className="input" /></Field>
              <Field label="Região" icon={<MapPin className="w-4 h-4" />}><input value={region} onChange={(e) => setRegion(e.target.value)} className="input" /></Field>
            </div>

            <div className="mt-5"><Field label="Especialidades" icon={<Sparkles className="w-4 h-4" />}><textarea value={specialties} onChange={(e) => setSpecialties(e.target.value)} className="input min-h-[90px]" /></Field></div>
            <div className="mt-5"><Field label="Nota biográfica curta" icon={<User className="w-4 h-4" />}><textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input min-h-[90px]" /></Field></div>

            {error && <ErrorBox message={error} />}

            <div className="mt-8 flex justify-end">
              <button onClick={createExpertProfile} disabled={loading} className="btn-primary">
                {loading ? 'A guardar…' : 'Guardar perfil'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {stage === 'module' && (
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-2">Escolher módulo de conhecimento</h2>
            <p className="text-zinc-400 mb-8">Para evitar entrevistas demasiado longas, cada módulo é preenchido separadamente.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {moduleCards.map((module) => {
                const p = progress[module.form_phase]
                const answered = p?.questions_answered ?? 0
                const total = module.estimated_questions || 0
                const percent = total > 0 ? Math.min(Math.round((answered / total) * 100), 100) : 0
                const disabled = total === 0

                return (
                  <button
                    key={module.module_code}
                    type="button"
                    disabled={disabled}
                    onClick={() => startModule(module)}
                    className={`text-left p-5 rounded-2xl border transition-all ${
                      disabled
                        ? 'border-zinc-800 bg-zinc-900/30 opacity-60 cursor-not-allowed'
                        : 'border-zinc-700 bg-zinc-900/40 hover:border-amber-400/70'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-mono text-amber-400">{module.module_code}</span>
                      <span className="text-xs text-zinc-400">{answered} / {total}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{module.module_name}</h3>
                    <p className="text-sm text-zinc-400 mb-4">{module.description}</p>
                    <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-zinc-500">
                      <span>{p?.status === 'completed' ? 'Completo' : p?.status === 'in_progress' ? 'Em curso' : 'Não iniciado'}</span>
                      <span>{percent}%</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {stage === 'interview' && selectedModule && currentQuestion && (
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <button type="button" onClick={backToModules} className="text-sm text-zinc-400 hover:text-amber-400 mb-6">← Voltar aos módulos</button>

            <div className="mb-6 text-sm text-zinc-400">
              <div>{selectedModule.module_name}</div>
              <div>Pergunta {questionIndex + 1} de {questions.length}</div>
            </div>

            <div className="text-amber-400 font-mono mb-2">
              {currentQuestion.food_archetype_code || currentQuestion.wine_profile_code}
            </div>

            <h2 className="text-3xl font-light mb-3">{currentQuestion.helper_text}</h2>
            <p className="text-zinc-400 text-lg mb-8">{currentQuestion.question_text}</p>

            <QuestionInput
              question={currentQuestion}
              selectedWine={selectedWine}
              setSelectedWine={setSelectedWine}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
            />

            <DescriptorSelector selectedDescriptors={selectedDescriptors} setSelectedDescriptors={setSelectedDescriptors} />

            <div className="mt-6">
              <Field label="Comentário opcional" icon={<Brain className="w-4 h-4" />}>
                <textarea
                  key={currentQuestion.question_code}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="input min-h-[100px]"
                  placeholder="Ex: explique em palavras suas, se quiser..."
                />
              </Field>
            </div>

            <div className="mt-6">
              <label className="block text-sm text-zinc-300 mb-2">Confiança: {confidence}</label>
              <input type="range" min="0.25" max="1" step="0.25" value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} className="w-full" />
            </div>

            {error && <ErrorBox message={error} />}

            <div className="mt-8 flex justify-between items-center">
              <span className="text-zinc-500 text-sm">{answeredInModule} resposta(s) neste módulo</span>
              <button onClick={saveAnswer} disabled={loading} className="btn-primary">
                {loading ? 'A guardar…' : 'Guardar e continuar'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
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
}: {
  question: Question
  selectedWine: string
  setSelectedWine: (value: string) => void
  selectedValue: string
  setSelectedValue: (value: string) => void
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

function DescriptorSelector({
  selectedDescriptors,
  setSelectedDescriptors,
}: {
  selectedDescriptors: string[]
  setSelectedDescriptors: React.Dispatch<React.SetStateAction<string[]>>
}) {
  return (
    <Field label="Que atributos justificam esta escolha?" icon={<Brain className="w-4 h-4" />}>
      <div className="space-y-6">
        {descriptorGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-3">{group.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.items.map((descriptor) => {
                const selected = selectedDescriptors.includes(descriptor.code)

                return (
                  <ChoiceButton
                    key={descriptor.code}
                    selected={selected}
                    onClick={() => {
                      setSelectedDescriptors((current) =>
                        selected
                          ? current.filter((code) => code !== descriptor.code)
                          : [...current, descriptor.code]
                      )
                    }}
                  >
                    <span className="font-mono text-amber-400 mr-2">{descriptor.code}</span>
                    <span className="text-sm text-zinc-300">{descriptor.label}</span>
                  </ChoiceButton>
                )
              })}
            </div>
          </div>
        ))}
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

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
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
