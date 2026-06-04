export type CookingMethod =
  | 'cru'
  | 'cozido'
  | 'vapor'
  | 'grelhado'
  | 'assado'
  | 'estufado'
  | 'frito'
  | 'salteado'
  | 'fumado'
  | 'bbq'

export type DishSensoryDimension =
  | 'acidity'
  | 'sweetness'
  | 'salinity'
  | 'umami'
  | 'richness'
  | 'spiciness'
  | 'intensity'

export type DishExample = {
  name: string
  archetypeCode: string
  cookingMethod: CookingMethod
}

export type DishSensoryProfile = {
  acidity: number
  sweetness: number
  salinity: number
  umami: number
  richness: number
  spiciness: number
  intensity: number
}

export const DISH_SENSORY_SCALE = {
  0: 'Ausente',
  1: 'Muito Baixo',
  2: 'Baixo',
  3: 'Médio',
  4: 'Alto',
  5: 'Dominante',
} as const

export const DISH_INTELLIGENCE_STORY = {
  title: 'Dish Intelligence',
  subtitle:
    'Pratos reais → Arquétipos → Perfil Sensorial',

  whyItMatters:
    'Os arquétipos simplificam a gastronomia, mas os clientes pedem pratos reais. Este módulo cria a ponte entre pratos concretos, arquétipos gastronómicos e perfis vínicos.',

  instructions: [
    'Indique até três pratos portugueses que representem bem cada arquétipo.',
    'Sempre que possível escolha pratos reconhecidos nacionalmente.',
    'Classifique o prato segundo o seu perfil sensorial.',
    'Considere o prato na sua versão mais tradicional.',
  ],

  impact:
    'Este conhecimento permitirá ao SomAS reconhecer pratos reais e recomendar vinhos com maior precisão.',
}

export const STARTER_DISH_EXAMPLES: DishExample[] =
  [
    {
      name: 'Ostras',
      archetypeCode: 'A01',
      cookingMethod: 'cru',
    },
    {
      name: 'Bacalhau Cozido',
      archetypeCode: 'A02',
      cookingMethod: 'cozido',
    },
    {
      name: 'Robalo Grelhado',
      archetypeCode: 'A03',
      cookingMethod: 'grelhado',
    },
    {
      name: 'Polvo à Lagareiro',
      archetypeCode: 'A04',
      cookingMethod: 'assado',
    },
    {
      name: 'Posta Mirandesa',
      archetypeCode: 'A10',
      cookingMethod: 'grelhado',
    },
    {
      name: 'Cabrito Assado',
      archetypeCode: 'A12',
      cookingMethod: 'assado',
    },
    {
      name: 'Javali Estufado',
      archetypeCode: 'A13',
      cookingMethod: 'estufado',
    },
  ]
