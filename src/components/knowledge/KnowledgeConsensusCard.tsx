type ConsensusItem = {
  label: string
  value: string
  votes: number
}

type Props = {
  internationalConsensus: ConsensusItem[]
  profileConsensus: ConsensusItem[]
}

export default function KnowledgeConsensusCard({
  internationalConsensus,
  profileConsensus,
}: Props) {
  const hasConsensus =
    internationalConsensus.length > 0 ||
    profileConsensus.length > 0

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">
        Consenso atual
      </h3>

      {!hasConsensus && (
        <p className="text-zinc-400 text-sm">
          Conhecimento em construção. Assim que existirem respostas
          suficientes, o consenso aparece aqui.
        </p>
      )}

      {internationalConsensus.length > 0 && (
        <div className="space-y-3 mb-4">
          {internationalConsensus.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-zinc-700 bg-zinc-900/40 p-4"
            >
              <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                Identidade internacional
              </div>

              <div className="font-semibold">
                {item.label}
              </div>

              <div className="text-xs text-zinc-500 mt-1">
                {item.votes} voto(s) de especialista
              </div>
            </div>
          ))}
        </div>
      )}

      {profileConsensus.length > 0 && (
        <div className="space-y-3">
          {profileConsensus.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-zinc-700 bg-zinc-900/40 p-4"
            >
              <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                Relação qualitativa
              </div>

              <div className="font-semibold">
                {item.label}
              </div>

              <div className="text-xs text-zinc-500 mt-1">
                {item.votes} voto(s) de especialista
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
