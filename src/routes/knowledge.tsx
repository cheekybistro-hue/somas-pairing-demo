import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Brain, User, Briefcase, MapPin, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

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

function KnowledgeInterview() {
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

  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const [expertId, setExpertId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    setCreated(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-zinc-50">
              SomAS <span className="font-semibold text-amber-400">Knowledge Interview</span>
            </h1>
          </div>

          <p className="text-zinc-400 text-lg font-light max-w-3xl mx-auto">
            Ajuda-nos a construir um motor de decisão único, alimentado por conhecimento humano especializado.
          </p>
        </div>

        {!created && (
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-light text-zinc-100 mb-2">
                Antes de começarmos
              </h2>
              <p className="text-zinc-400">
                Estes dados ajudam o SomAS a compreender a origem do conhecimento: chef, sommelier, enólogo,
                gastrónomo ou outro profissional. No futuro, isto permitirá consultar recomendações por perfil ou persona.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nome *" icon={<User className="w-4 h-4" />}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Osvaldo Amado"
                  className="input"
                />
              </Field>

              <Field label="Nome público / assinatura" icon={<Sparkles className="w-4 h-4" />}>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ex: Eng.º Osvaldo Amado"
                  className="input"
                />
              </Field>

              <Field label="Email" icon={<User className="w-4 h-4" />}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Opcional"
                  className="input"
                />
              </Field>

              <Field label="Função" icon={<Briefcase className="w-4 h-4" />}>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
                  <option value="">Selecionar função…</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Organização / contexto" icon={<Briefcase className="w-4 h-4" />}>
                <input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Restaurante, produtor, consultoria…"
                  className="input"
                />
              </Field>

              <Field label="Experiência" icon={<Sparkles className="w-4 h-4" />}>
                <select
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="input"
                >
                  <option value="">Selecionar experiência…</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="País" icon={<MapPin className="w-4 h-4" />}>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Região" icon={<MapPin className="w-4 h-4" />}>
                <input
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Ex: Dão, Bairrada, Lisboa…"
                  className="input"
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Especialidades" icon={<Sparkles className="w-4 h-4" />}>
                <textarea
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  placeholder="Ex: vinhos brancos, cozinha portuguesa, pairing, espumantes, fortificados…"
                  className="input min-h-[90px]"
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Nota biográfica curta" icon={<User className="w-4 h-4" />}>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Opcional. Uma frase sobre o teu percurso ou área de conhecimento."
                  className="input min-h-[90px]"
                />
              </Field>
            </div>

            {error && (
              <div className="mt-6 bg-red-950/40 border border-red-800/50 rounded-xl p-4 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={startSession}
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
              >
                {loading ? 'A iniciar…' : 'Iniciar entrevista'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {created && (
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-8 shadow-2xl max-w-3xl mx-auto text-center">
            <CheckCircle className="w-14 h-14 text-amber-400 mx-auto mb-4" />

            <h2 className="text-2xl font-light text-zinc-100 mb-3">
              Sessão iniciada com sucesso
            </h2>

            <p className="text-zinc-400 mb-6">
              O perfil foi guardado e a sessão de conhecimento foi criada. No próximo passo vamos apresentar perguntas
              curtas, adaptativas e com impacto visível no motor SomAS.
            </p>

            <div className="bg-zinc-900/60 rounded-xl p-4 text-left text-sm text-zinc-400 space-y-2">
              <p>
                <span className="text-zinc-500">Expert ID:</span> {expertId}
              </p>
              <p>
                <span className="text-zinc-500">Session ID:</span> {sessionId}
              </p>
            </div>

            <div className="mt-8 text-left bg-zinc-900/50 border border-zinc-700/50 rounded-xl p-5">
              <h3 className="text-amber-400 font-medium mb-2">
                Próxima fase
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Vamos criar o motor de perguntas: o SomAS irá escolher arquétipos e perfis com menor cobertura,
                fazer perguntas simples e guardar cada resposta como conhecimento validável.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
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
