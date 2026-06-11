import { useState } from 'react'

type Props = {
  title: string
  subtitle: string
  whyItMatters: string
  howToAnswer: string[]
  somasImpact: string
}

export function KnowledgeStoryCard({
  title,
  subtitle,
  whyItMatters,
  howToAnswer,
  somasImpact,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <section className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 mb-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-400 mb-2">
            Porque está a responder?
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
          className="px-4 py-2 rounded-xl border border-amber-400 text-amber-400 hover:bg-amber-400/10 text-sm"
        >
          {open ? 'Mostrar menos' : 'Saber mais'}
        </button>
      </div>

      <p className="text-zinc-300 mt-5 leading-relaxed">
        {whyItMatters}
      </p>

      {open && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-zinc-950/40 border border-zinc-700 rounded-xl p-5">
            <h3 className="font-semibold text-zinc-100 mb-3">
              Como responder
            </h3>

            <ul className="space-y-2 text-zinc-400 text-sm">
              {howToAnswer.map((item) => (
                <li key={item}>
                  • {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-zinc-950/40 border border-zinc-700 rounded-xl p-5">
            <h3 className="font-semibold text-zinc-100 mb-3">
              Como isto alimenta o SomAS
            </h3>

            <p className="text-zinc-400 text-sm leading-relaxed">
              {somasImpact}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
