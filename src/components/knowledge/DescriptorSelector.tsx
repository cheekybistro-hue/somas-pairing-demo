import { Brain } from 'lucide-react'
import { ReactNode, Dispatch, SetStateAction } from 'react'

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

type Props = {
  label: string
  selectedDescriptors: string[]
  setSelectedDescriptors: Dispatch<SetStateAction<string[]>>
}

export default function DescriptorSelector({
  label,
  selectedDescriptors,
  setSelectedDescriptors,
}: Props) {
  return (
    <Field label={label} icon={<Brain className="w-4 h-4" />}>
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
                    <span className="font-mono text-amber-400 mr-2">
                      {descriptor.code}
                    </span>
                    <span className="text-sm text-zinc-300">
                      {descriptor.label}
                    </span>
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

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-xl border transition-all ${
        selected
          ? 'border-amber-400 bg-amber-400/10'
          : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500'
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
  icon: ReactNode
  children: ReactNode
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
