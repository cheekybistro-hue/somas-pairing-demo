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

function KnowledgeInterview() {
  const [stage, setStage] = useState<'profile' | 'interview' | 'done'>('profile')

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

  const [questionIndex, setQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<any[]>([])
  const [selectedWine, setSelectedWine] = useState('')
  const [reason, setReason] = useState('')
  const [confidence, setConfidence] = useState(1)
  const [savedCount, setSavedCount] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

 const currentQuestion =
  questions.length > 0 ? questions[questionIndex] : null

  useEffect(() => {
  loadQuestions()
}, [])

async function loadQuestions() {
  const { data, error } = await supabase
    .from('knowledge_questions')
    .select('*')
    .eq('active', true)
    .order('priority')

  if (error) {
    console.error(error)
    return
  }

  setQuestions(data ?? [])
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
    form_phase: 'form_1_pairing_structure',
    knowledge_target: 'pairing',
    message:
      'Bem-vindo ao SomAS Knowledge Interview. Vamos começar a construir conhecimento sobre harmonização entre arquétipos gastronómicos e perfis vínicos.',
  })    
    setStage('interview')
    setLoading(false)
  }

 async function saveAnswer() {
  if (!expertId || !sessionId || !currentQuestion) return

  if (!selectedWine) {
    setError('Seleciona um perfil vínico.')
    return
  }

  setLoading(true)
  setError(null)

  const { error: insertError } = await supabase
    .from('knowledge_answers')
    .insert({
      session_id: sessionId,
      expert_id: expertId,
      question_code: currentQuestion.code,
      question_text: currentQuestion.question_text,
      answer_text: selectedWine,
      answer_json: {
        food_archetype_code: currentQuestion.food_archetype_code,
        wine_profile_code: selectedWine,
        reason,
        confidence,
      },
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
      form_phase: 'form_1_pairing_structure',
      knowledge_target: 'pairing',
      message: JSON.stringify({
        question_code: currentQuestion.code,
        wine_profile_code: selectedWine,
        reason,
        confidence,
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
  setSelectedWine('')
  setReason('')
  setConfidence(1)

  if (questionIndex + 1 >= questions.length) {
    await supabase
      .from('knowledge_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
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
          form_phase: 'form_1_pairing_structure',
          knowledge_target: 'pairing',
          message: nextQuestion.question_text,
        })
    }

    setQuestionIndex(questionIndex + 1)
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

        {stage === 'interview' && (
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="mb-6 text-sm text-zinc-400">
              Pergunta {questionIndex + 1} de {questions.length}
            </div>

            <div className="text-amber-400 font-mono mb-2">{currentQuestion.food_archetype_code}</div>

            <h2 className="text-3xl font-light mb-3">{currentQuestion.helper_text}</h2>
            <p className="text-zinc-400 text-lg mb-8">{currentQuestion.question_text}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {wineProfiles.map((wine) => (
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

            <Field label="Porque escolheu este perfil?" icon={<Brain className="w-4 h-4" />}>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input min-h-[100px]"
                placeholder="Ex: acidez, frescura, mineralidade, contraste com gordura..."
              />
            </Field>

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
            <h2 className="text-2xl font-light mb-3">Entrevista concluída</h2>
            <p className="text-zinc-400">
              Obrigado. As respostas foram guardadas e já fazem parte da camada de conhecimento SomAS.
            </p>
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
