import { useEffect, useState } from 'react'
import type { WineAromaticQuestion } from '../../lib/knowledge/wine-aromatic-form'
import { WINE_AROMATIC_SCALE } from '../../lib/knowledge/wine-aromatic-form'
import { WINE_PROFILES } from '../../lib/knowledge/pairing-taxonomy'

type Props = {
  question: WineAromaticQuestion
  values?: Record<string, number>
  onChange: (aromaticCode: string, value: number) => void
}

const AROMATIC_GROUPS = [
  {
    title: 'Fruta',
    helper: 'Famílias que ajudam o SomAS a reconhecer pontes frutadas entre vinho e prato.',
    codes: ['AF01', 'AF02', 'AF03', 'AF04', 'AF05'],
  },
  {
    title: 'Expressão varietal / lugar',
    helper: 'Notas que ligam frescura, origem, ervas, flores e mineralidade.',
    codes: ['AF06', 'AF07', 'AF08'],
  },
  {
    title: 'Enologia / evolução',
    helper: 'Notas associadas a madeira, especiarias, evolução, solo e fumo.',
    codes: ['AF11', 'AF10', 'AF09', 'AF13', 'AF12'],
  },
]

const SCALE_LEVELS = [0, 1, 2, 3, 4, 5] as const

export function WineAromaticQuestionCard({
  question,
  values = {},
  onChange,
}: Props) {
  const [localValues, setLocalValues] =
    useState<Record<string, number>>(values)

  useEffect(() => {
    setLocalValues(values)
  }, [values])

  const wineProfile = WINE_PROFILES.find(
    (profile) =>
      profile.code === question.wine_profile_code
  )

  function updateValue(code: string, value: number) {
    setLocalValues((current) => ({
      ...current,
      [code]: value,
    }))

    onChange(code, value)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-amber-400">
          {question.wine_profile_code}
        </div>

        <h2 className="text-xl font-semibold mt-2">
          {question.wine_profile_code}
          {wineProfile
            ? ` — ${wineProfile.title}`
            : ''}
        </h2>

        {wineProfile?.description && (
          <p className="text-zinc-400 mt-2">
            {wineProfile.description}
          </p>
        )}

        <p className="text-zinc-500 mt-4">
          {question.question_text}
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-zinc-700 bg-zinc-950/50 p-4">
        <p className="text-xs uppercase tracking-widest text-amber-400 mb-3">
          Escala aromática
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-zinc-300">
          {SCALE_LEVELS.map((level) => (
            <div key={level} className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-zinc-600 text-xs text-amber-300">
                {level}
              </span>
              <span>{WINE_AROMATIC_SCALE[level]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {AROMATIC_GROUPS.map((group) => {
          const families = question.aromatic_families.filter(
            (family) => group.codes.includes(family.code)
          )

          if (families.length === 0) return null

          return (
            <section key={group.title}>
              <div className="mb-4">
                <h3 className="text-sm uppercase tracking-widest text-amber-400">
                  {group.title}
                </h3>

                <p className="text-xs text-zinc-500 mt-1">
                  {group.helper}
                </p>
              </div>

              <div className="space-y-5">
                {families.map((family) => {
                  const currentValue =
                    localValues[family.code] ?? 0

                  return (
                    <div
                      key={family.code}
                      className="rounded-xl border border-zinc-700 bg-zinc-950/30 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium">
                              {family.name}
                            </div>

                            <div className="text-xs font-mono text-zinc-500">
                              {family.code}
                            </div>
                          </div>

                          <div className="text-xs text-zinc-500 mt-1">
                            {family.examples.join(', ')}
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-amber-400 font-semibold">
                            {currentValue}
                          </div>

                          <div className="text-xs text-zinc-500">
                            {WINE_AROMATIC_SCALE[currentValue as keyof typeof WINE_AROMATIC_SCALE]}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {SCALE_LEVELS.map((level) => {
                          const selected =
                            currentValue === level

                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() =>
                                updateValue(
                                  family.code,
                                  level
                                )
                              }
                              aria-label={`${family.name}: ${level} — ${WINE_AROMATIC_SCALE[level]}`}
                              className={
                                selected
                                  ? 'w-10 h-10 rounded-full bg-amber-500 text-black text-sm font-semibold'
                                  : 'w-10 h-10 rounded-full border border-zinc-600 text-zinc-300 text-sm hover:border-amber-400 hover:text-amber-300'
                              }
                            >
                              {level}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
