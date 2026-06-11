import { WINE_PROFILES } from './pairing-taxonomy'
import { AROMATIC_FAMILIES } from './aromatic-taxonomy'

export const WINE_AROMATIC_FORM_PHASE =
  'wine_aromatic'

export const WINE_AROMATIC_SCALE = {
  0: 'Ausente',
  1: 'Muito baixo',
  2: 'Baixo',
  3: 'Médio',
  4: 'Alto',
  5: 'Dominante',
} as const

export type WineAromaticQuestion = {
  question_code: string
  question_type: 'wine_aromatic_profile'
  wine_profile_code: string
  wine_profile_title: string
  question_text: string
  aromatic_families: typeof AROMATIC_FAMILIES
}

export const WINE_AROMATIC_STORY = {
  title: 'Wine Aromatic Intelligence',
  subtitle: 'Perfis vínicos → famílias aromáticas',
  whyItMatters:
    'Os aromas são uma dimensão essencial da perceção do vinho. Este módulo ajuda o SomAS a compreender como cada perfil vínico se expressa aromaticamente.',
  howToAnswer: [
    'Pense no perfil vínico WXX como estilo, não numa garrafa específica.',
    'Avalie a presença de cada família aromática numa escala de 0 a 5.',
    'Use 0 quando a família estiver ausente e 5 quando for dominante.',
    'Responda com base na sua experiência profissional e sensorial.',
  ],
  somasImpact:
    'Estas respostas vão criar uma biblioteca aromática colaborativa, permitindo recomendações mais humanas, sensoriais e explicáveis.',
}

export function buildWineAromaticQuestions(): WineAromaticQuestion[] {
  return WINE_PROFILES.map((profile) => ({
    question_code: `${profile.code}_AROMATIC_PROFILE`,
    question_type: 'wine_aromatic_profile',
    wine_profile_code: profile.code,
    wine_profile_title: profile.title,
    question_text: `Quais são as famílias aromáticas dominantes do perfil ${profile.code} — ${profile.title}?`,
    aromatic_families: AROMATIC_FAMILIES,
  }))
}
