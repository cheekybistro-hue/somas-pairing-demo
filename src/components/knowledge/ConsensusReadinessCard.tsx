type ConsensusItem = {
  questionCode: string
  totalResponses: number
  topAnswer: string
  agreementPercent: number
  confidenceScore: number
  consensusLevel: string
}

type Props = {
  items: ConsensusItem[]
}

export function ConsensusReadinessCard({
  items,
}: Props) {
  const strongest = items
    .filter(
      (item) =>
        item.consensusLevel === 'strong'
    )
    .slice(0, 5)

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8">
      <p className="text-xs uppercase tracking-widest text-amber-400">
        Consensus
      </p>

      <h3 className="text-2xl font-semibold">
        Strongest Consensus
      </h3>

      <p className="text-zinc-400 mt-2 mb-6">
        Perguntas com maior acordo entre especialistas.
      </p>

      <div className="space-y-4">
        {strongest.length === 0 && (
          <div className="text-zinc-500">
            Ainda não existem consensos fortes.
          </div>
        )}

        {strongest.map((item) => (
          <div
            key={item.questionCode}
            className="border border-zinc-700 rounded-xl p-4"
          >
            <div className="flex justify-between">
              <div>
                <div className="font-medium">
                  {item.questionCode}
                </div>

                <div className="text-sm text-zinc-400 mt-1">
                  {item.topAnswer}
                </div>
              </div>

              <div className="text-right">
                <div className="text-amber-400 font-semibold">
                  {item.agreementPercent}%
                </div>

                <div className="text-xs text-zinc-500">
                  acordo
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
