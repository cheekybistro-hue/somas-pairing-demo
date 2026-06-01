import { ArrowRight, Briefcase, MapPin, Sparkles, User } from 'lucide-react'
import { ReactNode } from 'react'

type Props = {
  name: string
  displayName: string
  email: string
  role: string
  organization: string
  yearsExperience: string
  country: string
  region: string
  specialties: string
  bio: string
  roles: string[]
  experienceLevels: string[]
  error: string | null
  loading: boolean
  onNameChange: (value: string) => void
  onDisplayNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onRoleChange: (value: string) => void
  onOrganizationChange: (value: string) => void
  onYearsExperienceChange: (value: string) => void
  onCountryChange: (value: string) => void
  onRegionChange: (value: string) => void
  onSpecialtiesChange: (value: string) => void
  onBioChange: (value: string) => void
  onSubmit: () => void
}

export default function KnowledgeProfileForm({
  name,
  displayName,
  email,
  role,
  organization,
  yearsExperience,
  country,
  region,
  specialties,
  bio,
  roles,
  experienceLevels,
  error,
  loading,
  onNameChange,
  onDisplayNameChange,
  onEmailChange,
  onRoleChange,
  onOrganizationChange,
  onYearsExperienceChange,
  onCountryChange,
  onRegionChange,
  onSpecialtiesChange,
  onBioChange,
  onSubmit,
}: Props) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-light mb-2">Completar perfil</h2>
      <p className="text-zinc-400 mb-8">Estes dados ajudam a criar a tua persona de conhecimento.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Nome *" icon={<User className="w-4 h-4" />}>
          <input value={name} onChange={(e) => onNameChange(e.target.value)} className="input" />
        </Field>

        <Field label="Nome público" icon={<Sparkles className="w-4 h-4" />}>
          <input value={displayName} onChange={(e) => onDisplayNameChange(e.target.value)} className="input" />
        </Field>

        <Field label="Email" icon={<User className="w-4 h-4" />}>
          <input value={email} onChange={(e) => onEmailChange(e.target.value)} className="input" type="email" />
        </Field>

        <Field label="Função" icon={<Briefcase className="w-4 h-4" />}>
          <select value={role} onChange={(e) => onRoleChange(e.target.value)} className="input">
            <option value="">Selecionar…</option>
            {roles.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>

        <Field label="Organização" icon={<Briefcase className="w-4 h-4" />}>
          <input value={organization} onChange={(e) => onOrganizationChange(e.target.value)} className="input" />
        </Field>

        <Field label="Experiência" icon={<Sparkles className="w-4 h-4" />}>
          <select value={yearsExperience} onChange={(e) => onYearsExperienceChange(e.target.value)} className="input">
            <option value="">Selecionar…</option>
            {experienceLevels.map((e) => <option key={e}>{e}</option>)}
          </select>
        </Field>

        <Field label="País" icon={<MapPin className="w-4 h-4" />}>
          <input value={country} onChange={(e) => onCountryChange(e.target.value)} className="input" />
        </Field>

        <Field label="Região" icon={<MapPin className="w-4 h-4" />}>
          <input value={region} onChange={(e) => onRegionChange(e.target.value)} className="input" />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Especialidades" icon={<Sparkles className="w-4 h-4" />}>
          <textarea value={specialties} onChange={(e) => onSpecialtiesChange(e.target.value)} className="input min-h-[90px]" />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Nota biográfica curta" icon={<User className="w-4 h-4" />}>
          <textarea value={bio} onChange={(e) => onBioChange(e.target.value)} className="input min-h-[90px]" />
        </Field>
      </div>

      {error && (
        <div className="mt-6 bg-red-950/40 border border-red-800/50 rounded-xl p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button onClick={onSubmit} disabled={loading} className="btn-primary">
          {loading ? 'A guardar…' : 'Guardar perfil'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
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
