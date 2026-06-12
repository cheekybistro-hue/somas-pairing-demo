export type DishIntensityLevel =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5

export type DishDimension = {
  code: string
  name: string
  description: string
}

export const DISH_DIMENSIONS: DishDimension[] = [
  {
    code: 'DS01',
    name: 'Intensidade Global',
    description:
      'Peso e impacto geral do prato.',
  },
  {
    code: 'DS02',
    name: 'Gordura',
    description:
      'Presença de gordura e untuosidade.',
  },
  {
    code: 'DS03',
    name: 'Acidez',
    description:
      'Sensação ácida do prato.',
  },
  {
    code: 'DS04',
    name: 'Doçura',
    description:
      'Presença de elementos doces.',
  },
  {
    code: 'DS05',
    name: 'Salinidade',
    description:
      'Perceção de sal.',
  },
  {
    code: 'DS06',
    name: 'Amargor',
    description:
      'Notas amargas dominantes.',
  },
  {
    code: 'DS07',
    name: 'Picante',
    description:
      'Presença de especiarias picantes.',
  },
  {
    code: 'DS08',
    name: 'Umami',
    description:
      'Profundidade e sabor persistente.',
  },
]

export const COOKING_METHODS = [
  'Cru',
  'Marinado',
  'Cozido',
  'Vapor',
  'Escalfado',
  'Salteado',
  'Grelhado',
  'Assado',
  'Estufado',
  'Frito',
  'Confitado',
  'Fumado',
] as const

export type DishIntelligenceQuestion = {
  archetypeCode: string
  archetypeName: string
  questionText: string
  dimensions: DishDimension[]
}
