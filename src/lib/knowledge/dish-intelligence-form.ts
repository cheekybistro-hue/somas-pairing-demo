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

export const DISH_INTENSITY_SCALE: Record<DishIntensityLevel, string> = {
  0: 'Ausente',
  1: 'Muito subtil',
  2: 'Presente mas secundário',
  3: 'Claro',
  4: 'Marcante',
  5: 'Dominante',
}

export const DISH_DIMENSIONS: DishDimension[] = [
  {
    code: 'DS01',
    name: 'Intensidade global',
    description:
      'Peso geral do prato na boca: concentração, persistência e impacto sensorial.',
  },
  {
    code: 'DS02',
    name: 'Richness / gordura',
    description:
      'Sensação de untuosidade, gordura, cremosidade ou riqueza de molho.',
  },
  {
    code: 'DS03',
    name: 'Acidez',
    description:
      'Frescura ácida do prato: limão, vinagre, tomate, marinada ou fermentação.',
  },
  {
    code: 'DS04',
    name: 'Doçura',
    description:
      'Presença de doçura natural ou adicionada: cebola, fruta, mel, caramelização.',
  },
  {
    code: 'DS05',
    name: 'Salinidade',
    description:
      'Perceção de sal, cura, mar, bacalhau, enchidos ou queijo.',
  },
  {
    code: 'DS06',
    name: 'Amargor',
    description:
      'Notas amargas de grelha, vegetais, torra, ervas ou redução.',
  },
  {
    code: 'DS07',
    name: 'Picante',
    description:
      'Calor de pimenta, malagueta, especiarias picantes ou condimentação intensa.',
  },
  {
    code: 'DS08',
    name: 'Umami',
    description:
      'Profundidade saborosa e persistente: caldos, cogumelos, carnes, peixe curado, queijo.',
  },
]

export const DISH_DIMENSION_GROUPS = [
  {
    title: 'Estrutura do prato',
    helper:
      'Avalia primeiro o peso geral do prato e a sensação de riqueza na boca.',
    codes: ['DS01', 'DS02'],
  },
  {
    title: 'Equilíbrio gustativo',
    helper:
      'Estas dimensões ajudam o SomAS a perceber frescura, contraste e tensão gastronómica.',
    codes: ['DS03', 'DS04', 'DS05', 'DS06'],
  },
  {
    title: 'Persistência e intensidade aromática',
    helper:
      'Regista o que pode marcar a escolha do vinho: picante, profundidade e sabor persistente.',
    codes: ['DS07', 'DS08'],
  },
] as const

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
  'Outro',
] as const

export type DishIntelligenceQuestion = {
  archetypeCode: string
  archetypeName: string
  questionText: string
  dimensions: DishDimension[]
}
