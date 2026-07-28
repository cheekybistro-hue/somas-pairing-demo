import {
  COOKING_METHODS,
  DISH_DIMENSION_GROUPS,
  DISH_DIMENSIONS,
  DISH_INTENSITY_SCALE,
  type DishIntensityLevel,
} from '../../lib/knowledge/dish-intelligence-form'
import { DISH_SUGGESTIONS } from '../../lib/knowledge/dish-suggestions'

type Props = {
  foodArchetypeCode: string
  dishName: string
  setDishName: (value: string) => void
  cookingMethod: string
  setCookingMethod: (value: string) => void
  sensoryValues: Record<string, number>
  setSensoryValues: (values: Record<string, number>) => void
}

const SCALE_LEVELS: DishIntensityLevel[] = [0, 1, 2, 3, 4, 5]

function getDimensionByCode(code: string) {
  return DISH_DIMENSIONS.find((dimension) => dimension.code === code)
}

export function DishQuestionCard({
  foodArchetypeCode,
  dishName,
  setDishName,
  cookingMethod,
  setCookingMethod,
  sensoryValues,
  setSensoryValues,
}: Props) {
  const suggestions =
    DISH_SUGGESTIONS[foodArchetypeCode] ?? []

  function selectDish(selectedDishName: string) {
    setDishName(selectedDishName)

    const suggestion = suggestions.find(
      (dish) => dish.name === selectedDishName
    )

    if (suggestion) {
      setCookingMethod(suggestion.cookingMethod)
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
      <div className="mb-6">
        <p className="mb-2 text-xs uppercase tracking-widest text-amber-400">
          Dish Intelligence
        </p>

        <h2 className="text-xl font-semibold">
          Ligar pratos reais ao conhecimento SomAS
        </h2>

        <p className="mt-2 text-zinc-400">
          Escolhe um prato representativo deste arquétipo e avalia-o como o provarias antes de escolher um vinho para acompanhar.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-4 text-sm text-zinc-400">
        <div className="mb-2 font-medium text-zinc-300">
          Escala sensorial
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SCALE_LEVELS.map((level) => (
            <div key={level}>
              <span className="font-semibold text-amber-400">
                {level}
              </span>{' '}
              {DISH_INTENSITY_SCALE[level]}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-8">
        <div className="rounded-xl border border-zinc-700 bg-zinc-950/30 p-5">
          <div className="mb-4">
            <h3 className="font-medium text-zinc-100">
              1. Prato
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Escolhe um prato português que ajude a representar este arquétipo gastronómico.
            </p>
          </div>

          <label className="mb-2 block text-sm text-zinc-300">
            Prato sugerido
          </label>

          <select
            value={dishName}
            onChange={(event) =>
              selectDish(event.target.value)
            }
            className="input"
          >
            <option value="">
              Selecionar prato...
            </option>

            {suggestions.map((dish) => (
              <option
                key={dish.name}
                value={dish.name}
              >
                {dish.name}{' '}
                {dish.origin === 'Portugal'
                  ? '🇵🇹'
                  : '🌍'}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-zinc-700 bg-zinc-950/30 p-5">
          <div className="mb-4">
            <h3 className="font-medium text-zinc-100">
              2. Confeção
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              A técnica dominante altera textura, gordura, intensidade e a forma como o vinho deve responder.
            </p>
          </div>

          <label className="mb-2 block text-sm text-zinc-300">
            Método de confeção dominante
          </label>

          <select
            value={cookingMethod}
            onChange={(event) =>
              setCookingMethod(event.target.value)
            }
            className="input"
          >
            <option value="">
              Selecionar método...
            </option>

            {COOKING_METHODS.map((method) => (
              <option
                key={method}
                value={method}
              >
                {method}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-5">
            <h3 className="font-medium text-zinc-100">
              3. Perfil sensorial do prato
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Não procures uma resposta académica. Regista a leitura sensorial que usarias numa decisão real de harmonização.
            </p>
          </div>

          <div className="space-y-6">
            {DISH_DIMENSION_GROUPS.map((group) => (
              <div
                key={group.title}
                className="rounded-xl border border-zinc-700 bg-zinc-950/30 p-5"
              >
                <div className="mb-5">
                  <h4 className="text-sm uppercase tracking-widest text-amber-400">
                    {group.title}
                  </h4>

                  <p className="mt-1 text-sm text-zinc-500">
                    {group.helper}
                  </p>
                </div>

                <div className="space-y-5">
                  {group.codes.map((code) => {
                    const dimension = getDimensionByCode(code)

                    if (!dimension) return null

                    const currentValue =
                      sensoryValues[dimension.code] ?? 0

                    return (
                      <div key={dimension.code}>
                        <div className="mb-2 flex justify-between gap-4">
                          <div>
                            <div className="font-medium">
                              {dimension.name}
                            </div>

                            <div className="text-xs text-zinc-500">
                              {dimension.description}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-amber-400">
                              {currentValue}
                            </div>

                            <div className="text-xs text-zinc-500">
                              {DISH_INTENSITY_SCALE[currentValue as DishIntensityLevel] ?? ''}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {SCALE_LEVELS.map((level) => {
                            const selected =
                              currentValue === level

                            return (
                              <button
                                key={level}
                                type="button"
                                title={DISH_INTENSITY_SCALE[level]}
                                onClick={() =>
                                  setSensoryValues({
                                    ...sensoryValues,
                                    [dimension.code]: level,
                                  })
                                }
                                className={
                                  selected
                                    ? 'h-9 w-9 rounded-full bg-amber-500 text-sm font-semibold text-black'
                                    : 'h-9 w-9 rounded-full border border-zinc-600 text-sm text-zinc-300 hover:border-amber-400 hover:text-amber-300'
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
