import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
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
} from 'lucide-react'

export const Route = createFileRoute('/knowledge')({
  component: KnowledgeInterview,
})

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

const experienceLevels = [
  '0 - 2 anos',
  '3 - 7 anos',
  '8 - 15 anos',
  '+15 anos',
]

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
  {
    title: 'Brancos',
    codes: ['W01', 'W02', 'W03', 'W04', 'W05', 'W06'],
  },
  {
    title: 'Espumantes',
    codes: ['W07', 'W08', 'W09'],
  },
  {
    title: 'Rosés',
    codes: ['W10', 'W11'],
  },
  {
    title: 'Tintos',
    codes: ['W12', 'W13', 'W14', 'W15', 'W16', 'W17', 'W18', 'W19', 'W20'],
  },
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

function KnowledgeInterview() {
  const [stage, setStage] = useState<'profile' | 'module' | 'interview' | 'done'>('profile')

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

  const [modules, setModules] = useState<any[]>([])
  const [selectedModule, setSelectedModule] = useState<any | null>(null)

  const [questionIndex, setQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<any[]>([])
  const [selectedWine, setSelectedWine] = useState('')
  const [nationalAnswer, setNationalAnswer] = useState('')
  const [reason, setReason] = useState('')
  const [selectedDescriptors, setSelectedDescriptors] = useState<string[]>([])
  const [confidence, setConfidence] = useState(1)
  const [savedCount, setSavedCount] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentQuestion =
    questions.length > 0 ? questions[questionIndex] : null

  useEffect(() => {
    loadModules()
  }, [])

  async function loadModules() {
    const { data, error } = await supabase
      .from('knowledge_modules')
      .select('*')
      .eq('active', true)
      .order('sort_order')

    if (error) {
      console.error(error)
      setError(error.message)
      return
    }

    setModules(data ?? [])
  }

  async function loadQuestionsForModule(formPhase: string) {
    const { data, error } = await supabase
      .from('knowledge_questions')
      .select('*')
      .eq('active', true)
      .eq('form_phase', formPhase)
      .order('priority')

    if (error) {
      console.error(error)
      setError(error.message)
      return []
    }

    return data ?? []
  }

  function resetAnswerFields() {
    setSelectedWine('')
    setNationalAnswer('')
    setSelectedDescriptors([])
    setReason('')
    setConfidence(1)
  }

  function isPairingQuestion() {
    return currentQuestion?.question_type === 'pairing_choice'
  }

  function getNationalLabel() {
    if (!currentQuestion) return 'Resposta'

    if (currentQuestion.question_type === 'national_region') {
      return 'Região portuguesa'
    }

    if (currentQuestion.question_type === 'national_grape') {
      return 'Casta portuguesa'
    }

    if (currentQuestion.question_type === 'national_reference') {
      return 'Produtor, rótulo ou vinho de referência'
    }

    return 'Resposta'
  }

  function getNationalPlaceholder() {
    if (!currentQuestion) return ''

    if (currentQuestion.question_type === 'national_region') {
      return 'Ex: Dão, Bairrada, Douro, Vinho Verde, Lisboa...'
    }

    if (currentQuestion.question_type === 'national_grape') {
      return 'Ex: Encruzado, Alvarinho, Arinto, Baga, Touriga Nacional...'
    }

    if (currentQuestion.question_type === 'national_reference') {
      return 'Ex: produtor, rótulo, vinho ou ano se relevante...'
    }

    return ''
  }

  async function startSession() {
    if (!name.trim()) {
      setError('Indica pelo menos o nome para começarmos.')
      return
    }

    setLoading(true)
    setError(null)

    const { data: expert, error: expertError } = await supabase
      .from('expert_profiles')
      .insert({
        name: name.trim(),
        display_name: displayName.trim() || name.trim(),
        email: email.trim() || null,
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

    const { data: session, error: sessionError } = await supabase
      .from('knowledge_sessions')
      .insert({
        expert_id: expert.id,
        status: 'started',
      })
      .select('id')
      .single()

    if (sessionError) {
      setError(sessionError.message)
      setLoading(false)
      return
    }

    setExpertId(expert.id)
    setSessionId(session.id)

    await supabase
      .from('interview_messages')
      .insert({
        session_id: session.id,
        expert_id: expert.id,
        role: 'assistant',
        form_phase: 'module_selection',
        knowledge_target: 'module_selection',
        message:
          'Bem-vindo ao SomAS Knowledge Interview. Vamos escolher o módulo de conhecimento a preencher.',
      })

    setStage('module')
    setLoading(false)
  }

  async function startModule(module: any) {
    if (!expertId || !sessionId) return

    setLoading(true)
    setError(null)
    resetAnswerFields()
    setQuestionIndex(0)
    setSavedCount(0)

    const moduleQuestions = await loadQuestionsForModule(module.form_phase)

    if (moduleQuestions.length === 0) {
      setError('Este módulo ainda não tem perguntas ativas.')
      setLoading(false)
      return
    }

    setSelectedModule(module)
    setQuestions(moduleQuestions)

    await supabase
      .from('expert_module_progress')
      .upsert(
        {
          expert_id: expertId,
          form_phase: module.form_phase,
          status: 'in_progress',
          questions_answered: 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'expert_id,form_phase' }
      )

    await supabase
      .from('interview_messages')
      .insert({
        session_id: sessionId,
        expert_id: expertId,
        role: 'assistant',
        form_phase: module.form_phase,
        knowledge_target: module.module_code,
        message: `Vamos iniciar o módulo: ${module.module_name}`,
      })

    setStage('interview')
    setLoading(false)

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  async function saveAnswer() {
    if (!expertId || !sessionId || !currentQuestion) return

    if (isPairingQuestion() && !selectedWine) {
      setError('Seleciona um perfil vínico.')
      return
    }

    if (!isPairingQuestion() && !nationalAnswer.trim()) {
      setError('Preenche a resposta antes de continuar.')
      return
    }

    setLoading(true)
    setError(null)

    const answerText = isPairingQuestion()
      ? selectedWine
      : nationalAnswer.trim()

    const answerJson = isPairingQuestion()
      ? {
          question_type: currentQuestion.question_type,
          food_archetype_code: currentQuestion.food_archetype_code,
          wine_profile_code: selectedWine,
          descriptors: selectedDescriptors,
          reason,
          confidence,
        }
      : {
          question_type: currentQuestion.question_type,
          wine_profile_code: currentQuestion.wine_profile_code,
          value: nationalAnswer.trim(),
          descriptors: selectedDescriptors,
          reason,
          confidence,
        }

    const { error: insertError } = await supabase
      .from('knowledge_answers')
      .insert({
        session_id: sessionId,
        expert_id: expertId,
        question_code: currentQuestion.question_code,
        question_text: currentQuestion.question_text,
        answer_text: answerText,
        answer_json: answerJson,
        confidence,
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    await supabase
      .from('interview_messages')
      .insert({
        session_id: sessionId,
        expert_id: expertId,
        role: 'expert',
        form_phase: currentQuestion.form_phase,
        knowledge_target: currentQuestion.question_type,
        message: JSON.stringify({
          question_code: currentQuestion.question_code,
          answer_text: answerText,
          answer_json: answerJson,
        }),
      })

    const newCount = savedCount + 1

    await supabase
      .from('knowledge_sessions')
      .update({
        questions_answered: newCount,
        knowledge_points_generated: newCount,
      })
      .eq('id', sessionId)

    setSavedCount(newCount)

    if (questionIndex + 1 >= questions.length) {
      if (selectedModule) {
        await supabase
          .from('expert_module_progress')
          .upsert(
            {
              expert_id: expertId,
              form_phase: selectedModule.form_phase,
              status: 'completed',
              questions_answered: newCount,
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'expert_id,form_phase' }
          )
      }

      await supabase
        .from('knowledge_sessions')
        .update({
          status: 'module_completed',
          questions_answered: newCount,
          knowledge_points_generated: newCount,
        })
        .eq('id', sessionId)

      setStage('done')
    } else {
      const nextQuestion = questions[questionIndex + 1]

      if (nextQuestion) {
        await supabase
          .from('interview_messages')
          .insert({
            session_id: sessionId,
            expert_id: expertId,
            role: 'assistant',
            form_phase: nextQuestion.form_phase,
            knowledge_target: nextQuestion.question_type,
            message: nextQuestion.question_text,
          })
      }

      setQuestionIndex(questionIndex + 1)
      resetAnswerFields()

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }, 100)
    }

    setLoading(false)
  }

  if (stage === 'interview' && !currentQuestion) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">
            A carregar perguntas...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight">
              SomAS <span className="font-semibold text-amber-400">Knowledge Interview</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Cada resposta ajuda a construir o motor de decisão SomAS.
          </p>
        </div>

        {stage === 'profile' && (
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-2">Antes de começarmos</h2>
            <p className="text-zinc-400 mb-8">
              Estes dados ajudam a criar a persona de conhecimento do especialista.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nome *" icon={<User className="w-4 h-4" />}>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
              </Field>

              <Field label="Nome público" icon={<Sparkles className="w-4 h-4" />}>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input" />
              </Field>

              <Field label="Email" icon={<User className="w-4 h-4" />}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
              </Field>

              <Field label="Função" icon={<Briefcase className="w-4 h-4" />}>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
                  <option value="">Selecionar…</option>
                  {roles.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>

              <Field label="Organização" icon={<Briefcase className="w-4 h-4" />}>
                <input value={organization} onChange={(e) => setOrganization(e.target.value)} className="input" />
              </Field>

              <Field label="Experiência" icon={<Sparkles className="w-4 h-4" />}>
                <select value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} className="input">
                  <option value="">Selecionar…</option>
                  {experienceLevels.map((e) => <option key={e}>{e}</option>)}
                </select>
              </Field>

              <Field label="País" icon={<MapPin className="w-4 h-4" />}>
                <input value={country} onChange={(e) => setCountry(e.target.value)} className="input" />
              </Field>

              <Field label="Região" icon={<MapPin className="w-4 h-4" />}>
                <input value={region} onChange={(e) => setRegion(e.target.value)} className="input" />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Especialidades" icon={<Sparkles className="w-4 h-4" />}>
                <textarea value={specialties} onChange={(e) => setSpecialties(e.target.value)} className="input min-h-[90px]" />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Nota biográfica curta" icon={<User className="w-4 h-4" />}>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input min-h-[90px]" />
              </Field>
            </div>

            {error && <ErrorBox message={error} />}

            <div className="mt-8 flex justify-end">
              <button onClick={startSession} disabled={loading} className="btn-primary">
                {loading ? 'A iniciar…' : 'Iniciar entrevista'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {stage === 'module' && (
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-2">Escolher módulo de conhecimento</h2>
            <p className="text-zinc-400 mb-8">
              Para evitar entrevistas demasiado longas, cada módulo é preenchido separadamente.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((module) => (
                <button
                  key={module.module_code}
                  type="button"
                  onClick={() => startModule(module)}
                  disabled={loading || module.estimated_questions === 0}
                  className={`text-left p-5 rounded-2xl border transition-all ${
                    module.estimated_questions === 0
                      ? 'border-zinc-800 bg-zinc-900/30 opacity-60 cursor-not-allowed'
                      : 'border-zinc-700 bg-zinc-900/50 hover:border-amber-400 hover:bg-amber-400/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="text-amber-400 font-mono text-sm mb-1">
                        {module.module_code}
                      </div>
                      <h3 className="text-xl font-medium text-zinc-100">
                        {module.module_name}
                      </h3>
                    </div>
                    <span className="text-sm text-zinc-400 whitespace-nowrap">
                      {module.estimated_questions} perguntas
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm">
                    {module.description}
                  </p>
                </button>
              ))}
            </div>

            {error && <ErrorBox message={error} />}
          </div>
        )}

        {stage === 'interview' && currentQuestion && (
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col gap-1 text-sm text-zinc-400">
              <span>{selectedModule?.module_name}</span>
              <span>Pergunta {questionIndex + 1} de {questions.length}</span>
            </div>

            <div className="text-amber-400 font-mono mb-2">
              {currentQuestion.food_archetype_code || currentQuestion.wine_profile_code}
            </div>

            <h2 className="text-3xl font-light mb-3">{currentQuestion.helper_text}</h2>
            <p className="text-zinc-400 text-lg mb-8">{currentQuestion.question_text}</p>

            {isPairingQuestion() ? (
              <div className="mb-8">
                {wineProfileGroups.map((group) => {
                  const profiles = wineProfiles.filter((wine) =>
                    group.codes.includes(wine.code)
                  )

                  return (
                    <div key={group.title} className="mb-8">
                      <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-3">
                        {group.title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {profiles.map((wine) => (
                          <button
                            key={wine.code}
                            onClick={() => setSelectedWine(wine.code)}
                            className={`text-left p-4 rounded-xl border transition-all ${
                              selectedWine === wine.code
                                ? 'border-amber-400 bg-amber-400/10'
                                : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500'
                            }`}
                          >
                            <div className="flex gap-2 items-center mb-1">
                              <Wine className="w-4 h-4 text-amber-400" />
                              <span className="font-mono text-amber-400">{wine.code}</span>
                            </div>
                            <div className="text-sm text-zinc-300">{wine.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mb-8">
                <Field label={getNationalLabel()} icon={<MapPin className="w-4 h-4" />}>
                  <input
                    key={currentQuestion.question_code}
                    value={nationalAnswer}
                    onChange={(e) => setNationalAnswer(e.target.value)}
                    className="input"
                    placeholder={getNationalPlaceholder()}
                  />
                </Field>
              </div>
            )}

            <Field label="Que atributos justificam esta escolha?" icon={<Brain className="w-4 h-4" />}>
              <div className="space-y-6">
                {descriptorGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-3">
                      {group.title}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {group.items.map((descriptor) => {
                        const selected = selectedDescriptors.includes(descriptor.code)

                        return (
                          <button
                            key={descriptor.code}
                            type="button"
                            onClick={() => {
                              setSelectedDescriptors((current) =>
                                selected
                                  ? current.filter((code) => code !== descriptor.code)
                                  : [...current, descriptor.code]
                              )
                            }}
                            className={`text-left p-3 rounded-xl border transition-all ${
                              selected
                                ? 'border-amber-400 bg-amber-400/10'
                                : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500'
                            }`}
                          >
                            <span className="font-mono text-amber-400 mr-2">
                              {descriptor.code}
                            </span>
                            <span className="text-sm text-zinc-300">
                              {descriptor.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Field>

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
              <label className="block text-sm text-zinc-300 mb-2">
                Confiança: {confidence}
              </label>
              <input
                type="range"
                min="0.25"
                max="1"
                step="0.25"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {error && <ErrorBox message={error} />}

            <div className="mt-8 flex justify-between items-center">
              <span className="text-zinc-500 text-sm">{savedCount} resposta(s) guardada(s)</span>
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
            <p className="text-zinc-400 mb-2">
              {selectedModule?.module_name || 'Este módulo'} foi guardado com sucesso.
            </p>
            <p className="text-zinc-500 text-sm mb-8">
              {savedCount} resposta(s) registada(s) na camada de conhecimento SomAS.
            </p>
            <button
              type="button"
              onClick={() => {
                setStage('module')
                setSelectedModule(null)
                setQuestions([])
                resetAnswerFields()
                setQuestionIndex(0)
                setSavedCount(0)
              }}
              className="btn-primary mx-auto"
            >
              Escolher outro módulo
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
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
