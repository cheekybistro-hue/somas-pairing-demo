import {
  COOKING_METHODS,
  DISH_DIMENSIONS,
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

  function selectDish(dishName: string) {
    setDishName(dishName)

    const suggestion = suggestions.find(
      (dish) => dish.name === dishName
    )

    if (suggestion) {
      setCookingMethod(suggestion.cookingMethod)
    }
  }

  return (
    <section className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
      <h2 className="text-xl font-semibold">
        Dish Intelligence
      </h2>

      <p className="text-zinc-400 mt-2">
        Escolha um prato representativo deste arquétipo e avalie o seu perfil sensorial.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
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

        {/* custom dish next PR */}

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
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

        <div className="space-y-5">
          {DISH_DIMENSIONS.map((dimension) => {
            const currentValue =
              sensoryValues[dimension.code] ?? 0

            return (
              <div key={dimension.code}>
                <div className="flex justify-between gap-4 mb-2">
                  <div>
                    <div className="font-medium">
                      {dimension.name}
                    </div>

                    <div className="text-xs text-zinc-500">
                      {dimension.description}
                    </div>
                  </div>

                  <div className="text-amber-400 font-semibold">
                    {currentValue}
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  {[0, 1, 2, 3, 4, 5].map((level) => {
                    const selected =
                      currentValue === level

                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          setSensoryValues({
                            ...sensoryValues,
                            [dimension.code]: level,
                          })
                        }
                        className={
                          selected
                            ? 'w-9 h-9 rounded-full bg-amber-500 text-black text-sm font-semibold'
                            : 'w-9 h-9 rounded-full border border-zinc-600 text-zinc-300 text-sm hover:border-amber-400 hover:text-amber-300'
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
    </section>
  )
}
