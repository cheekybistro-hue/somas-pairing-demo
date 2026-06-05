type ContributionModule = {
  name: string
  answered: number
  total: number
}

type Props = {
  modules: ContributionModule[]
}

export function MyContributionsCard({
  modules,
}: Props) {
  const totalAnswered = modules.reduce(
    (sum, module) => sum + module.answered,
    0
  )

  const totalQuestions = modules.reduce(
    (sum, module) => sum + module.total,
    0
  )

  const progress =
    totalQuestions === 0
      ? 0
      : Math.round(
          (totalAnswered / totalQuestions) * 100
        )

  return (
    <section className="bg-zinc-900/60 border border-zinc-700 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-400">
            Participação
          </p>

          <h2 className="text-2xl font-semibold">
            My Contributions
          </h2>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-amber-400">
            {progress}%
          </div>

          <div className="text-sm text-zinc-500">
            concluído
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((module) => {
          const moduleProgress =
            module.total === 0
              ? 0
              : Math.round(
                  (module.answered /
                    module.total) *
                    100
                )

          return (
            <div
              key={module.name}
              className="space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span>{module.name}</span>

                <span className="text-zinc-400">
                  {module.answered}/{module.total}
                </span>
              </div>

              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{
                    width: `${moduleProgress}%`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
