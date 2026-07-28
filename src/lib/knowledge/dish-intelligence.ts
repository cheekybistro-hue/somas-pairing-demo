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
  1: 'Muito subtil',
  2: 'Presente mas secundário',
  3: 'Claro',
  4: 'Marcante',
  5: 'Dominante',
} as const

export const DISH_INTELLIGENCE_STORY = {
  title: 'Dish Intelligence',
  subtitle:
    'Pratos reais → Arquétipos → Perfil sensorial',

  whyItMatters:
    'A harmonização nasce no prato real. Até agora, o SomAS conhece arquétipos gastronómicos e perfis vínicos; neste módulo ligamos essa estrutura a pratos concretos da gastronomia portuguesa.',

  instructions: [
    'Escolhe um prato que represente bem o arquétipo gastronómico apresentado.',
    'Avalia o prato como o provarias antes de escolher um vinho para o acompanhar.',
    'Considera a versão mais tradicional ou reconhecível do prato.',
    'Classifica confeção, acidez, riqueza, salinidade, umami, picante e intensidade com a escala 0–5.',
  ],

  impact:
    'Estas respostas ajudam o SomAS a transformar conhecimento gastronómico em recomendações mais humanas, explicáveis e próximas da realidade dos restaurantes portugueses.',
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
