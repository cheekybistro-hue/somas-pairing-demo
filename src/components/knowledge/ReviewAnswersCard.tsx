type ReviewAnswer = {
  id: string
  moduleName: string
  questionLabel: string
  answerSummary: string
  confidence?: number | null
  createdAt?: string | null
}

type Props = {
  answers: ReviewAnswer[]
}

export function ReviewAnswersCard({
  answers,
}: Props) {
  return (
    <section className="bg-zinc-900/60 border border-zinc-700 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-400">
            Conhecimento Partilhado
          </p>

          <h2 className="text-2xl font-semibold">
            Review My Answers
          </h2>
        </div>

        <div className="text-sm text-zinc-500">
          {answers.length} respostas
        </div>
      </div>

      {answers.length === 0 ? (
        <p className="text-zinc-500">
          Ainda não existem respostas registadas.
        </p>
      ) : (
        <div className="space-y-4">
          {answers.map((answer) => (
            <div
              key={answer.id}
              className="border border-zinc-700 rounded-xl p-4"
            >
              <div className="flex justify-between mb-2">
                <span className="text-amber-400 text-sm">
                  {answer.moduleName}
                </span>

                {answer.confidence != null && (
                  <span className="text-zinc-400 text-sm">
                    Confiança {answer.confidence}
                  </span>
                )}
              </div>

              <div className="font-medium text-zinc-200">
                {answer.questionLabel}
              </div>

              <div className="text-zinc-400 mt-2">
                {answer.answerSummary}
              </div>

              {answer.createdAt && (
                <div className="text-xs text-zinc-600 mt-3">
                  {new Date(
                    answer.createdAt
                  ).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
