import type { WineAromaticQuestion } from '../../lib/knowledge/wine-aromatic-form'

type Props = {
  question: WineAromaticQuestion

  values: Record<string, number>

  onChange: (
    aromaticCode: string,
    value: number
  ) => void
}

export function WineAromaticQuestionCard({
  question,
  values,
  onChange,
}: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-amber-400">
          {question.wine_profile_code}
        </div>

        <h2 className="text-xl font-semibold mt-2">
          {question.wine_profile_title}
        </h2>

        <p className="text-zinc-400 mt-3">
          {question.question_text}
        </p>
      </div>

      <div className="space-y-5">
        {question.aromatic_families.map(
          (family) => (
            <div key={family.code}>
              <div className="flex justify-between mb-2">
                <div>
                  <div className="font-medium">
                    {family.name}
                  </div>

                  <div className="text-xs text-zinc-500">
                    {family.examples.join(', ')}
                  </div>
                </div>

                <div className="text-amber-400">
                  {values[family.code] ?? 0}
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={
                  values[family.code] ?? 0
                }
                onChange={(e) =>
                  onChange(
                    family.code,
                    Number(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>
          )
        )}
      </div>
    </div>
  )
}
