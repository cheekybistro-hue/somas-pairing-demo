type ReviewAnswer = {
  id: string
  question_code: string
  question_text: string
  answer_text: string | null
  answer_json: any
  confidence: number | null
  created_at: string | null
}

type Props = {
  moduleName: string
  answers: ReviewAnswer[]
  onBack: () => void
  onContinue: () => void
  onEdit: (answer: ReviewAnswer) => void
}

export function ModuleReviewCard({
  moduleName,
  answers,
  onBack,
  onContinue,
  onEdit,
}: Props) {
  return (
    <section className="bg-zinc-900/60 border border-zinc-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-400">
            Revisão
          </p>

          <h2 className="text-2xl font-semibold">
            {moduleName}
          </h2>
        </div>

        <div className="text-sm text-zinc-500">
          {answers.length} respostas
        </div>
      </div>

      <div className="space-y-4">
        {answers.map((answer) => (
          <div
            key={answer.id}
            className="border border-zinc-700 rounded-xl p-4"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="text-sm text-amber-400">
                  {answer.question_code}
                </div>

                <div className="text-zinc-300 mt-1">
                  {answer.question_text}
                </div>
              </div>

              {answer.confidence != null && (
                <div className="text-xs text-zinc-500">
                  Confiança {answer.confidence}
                </div>
              )}
            </div>

<div className="mt-3">
  <pre className="text-xs text-zinc-300 whitespace-pre-wrap">
    {answer.answer_text ??
      (answer.answer_json
        ? JSON.stringify(
            answer.answer_json,
            null,
            2
          )
        : '-')}
  </pre>
</div>

<div className="mt-4">
<button
  type="button"
  onClick={() => onEdit(answer)}
  className="px-3 py-2 rounded-lg border border-amber-500 text-amber-400 text-sm hover:bg-amber-500/10"
>
  Editar resposta
</button>
</div>
            
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-zinc-600"
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="px-4 py-2 rounded-xl bg-amber-500 text-black font-medium"
        >
          Continuar módulo
        </button>
      </div>
    </section>
  )
}
