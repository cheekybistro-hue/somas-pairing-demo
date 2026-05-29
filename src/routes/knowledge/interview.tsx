import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/knowledge/interview')({
  component: InterviewPage,
})

function InterviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-light mb-4">
          SomAS <span className="text-amber-400 font-semibold">Knowledge Interview</span>
        </h1>

        <p className="text-zinc-400 mb-10">
          Primeira versão da entrevista dinâmica.
        </p>

        <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-8">
          <h2 className="text-xl mb-4">
            Pergunta 1
          </h2>

          <p className="text-zinc-300 mb-6">
            Quando harmoniza um vinho com um prato,
            qual é o fator mais importante?
          </p>

          <textarea
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 min-h-[120px]"
            placeholder="Escreva a sua resposta..."
          />

          <button
            className="mt-6 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-6 py-3 rounded-xl"
          >
            Guardar resposta
          </button>
        </div>

      </div>
    </div>
  )
}
