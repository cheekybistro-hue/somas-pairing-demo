import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

type Props = {
  title: string
  subtitle: string
  whyItMatters: string
  howToAnswer: string[]
  somasImpact: string
}

function GuidanceToggle({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  const Icon = open ? ChevronDown : ChevronRight

  return (
    <div className="border border-zinc-700 rounded-xl bg-zinc-950/30 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-zinc-900/60 transition-colors"
      >
        <span className="font-semibold text-zinc-100">{title}</span>
        <Icon className="w-5 h-5 text-amber-400 shrink-0" />
      </button>

      {open && (
        <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

export function KnowledgeStoryCard({
  title,
  subtitle,
  whyItMatters,
  howToAnswer,
  somasImpact,
}: Props) {
  const [open, setOpen] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)
  const [whyOpen, setWhyOpen] = useState(false)

  return (
    <section className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 mb-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-400 mb-2">
            Propósito do formulário
          </p>

          <h2 className="text-2xl font-semibold text-zinc-100">
            {title}
          </h2>

          <p className="text-zinc-300 mt-2">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="px-4 py-2 rounded-xl border border-amber-400 text-amber-400 hover:bg-amber-400/10 text-sm shrink-0"
        >
          {open ? 'Mostrar menos' : 'Saber mais'}
        </button>
      </div>

      <p className="text-zinc-300 mt-5 leading-relaxed">
        {whyItMatters}
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <GuidanceToggle
          title="Como preencher"
          open={answerOpen}
          onToggle={() => setAnswerOpen((value) => !value)}
        >
          <ul className="space-y-2">
            {howToAnswer.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>

          {!open && (
            <p className="text-xs text-amber-400 mt-3">
              Abra “Saber mais” para ver a lógica completa de preenchimento.
            </p>
          )}
        </GuidanceToggle>

        <GuidanceToggle
          title="Porque fazemos assim"
          open={whyOpen}
          onToggle={() => setWhyOpen((value) => !value)}
        >
          <p>
            {open
              ? somasImpact
              : 'Cada resposta é guardada de forma estruturada para gerar consenso entre especialistas e alimentar recomendações explicáveis.'}
          </p>
        </GuidanceToggle>
      </div>
    </section>
  )
}
