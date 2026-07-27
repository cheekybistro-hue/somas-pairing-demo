import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/knowledge/review/$moduleCode')({
  component: KnowledgeModuleReviewPage,
})

const MODULE_TITLES: Record<string, string> = {
  FORM2: 'Identidade Nacional',
}

function KnowledgeModuleReviewPage() {
  const { moduleCode } = Route.useParams()
  const moduleTitle = MODULE_TITLES[moduleCode] ?? moduleCode

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          to="/knowledge"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-amber-300"
        >
          <ArrowLeft size={16} />
          Voltar ao portal
        </Link>

        <section className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
              <BookOpen size={24} />
            </div>

            <div>
              <p className="mb-1 text-xs uppercase tracking-widest text-amber-400">
                {moduleCode}
              </p>
              <h1 className="text-3xl font-light">
                Rever respostas — {moduleTitle}
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-zinc-400">
            Esta revisão permite confirmar o conhecimento que já partilhou neste
            módulo antes de continuar a construir a inteligência coletiva do
            SomAS.
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/40 p-6 text-zinc-500">
            As respostas exclusivas deste módulo serão apresentadas aqui no
            próximo passo do PR10.
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              to="/knowledge"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-600 px-5 py-3 text-sm text-zinc-300 transition hover:border-amber-400 hover:text-amber-300"
            >
              <ArrowLeft size={16} />
              Voltar
            </Link>

            <Link
              to="/knowledge"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-medium text-black transition hover:bg-amber-400"
            >
              Continuar módulo
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
