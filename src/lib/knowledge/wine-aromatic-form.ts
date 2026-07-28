import { WINE_PROFILES } from './pairing-taxonomy'
import { AROMATIC_FAMILIES } from './aromatic-taxonomy'

export const WINE_AROMATIC_FORM_PHASE =
  'wine_aromatic'

export const WINE_AROMATIC_SCALE = {
  0: 'Ausente',
  1: 'Muito subtil',
  2: 'Presente mas secundário',
  3: 'Claro',
  4: 'Marcante',
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
    'A dimensão aromática permite ao SomAS reconhecer pontes subtis entre vinho e prato: fruta, ervas, especiarias, madeira, mineralidade e notas de evolução.',
  howToAnswer: [
    'Pense no perfil vínico WXX como estilo, não numa garrafa específica.',
    'Avalie a presença de cada família aromática numa escala de 0 a 5.',
    'Use 0 quando a família estiver ausente e 5 quando for dominante.',
    'Dê mais peso aos aromas que estruturam a identidade do perfil, não a notas ocasionais.',
    'Responda com base na sua experiência profissional e sensorial.',
  ],
  somasImpact:
    'Estas respostas criam uma biblioteca aromática colaborativa dos perfis W01–W30, permitindo recomendações mais sensoriais, explicáveis e humanas.',
}

export function buildWineAromaticQuestions(): WineAromaticQuestion[] {
  return WINE_PROFILES.map((profile) => ({
    question_code: `${profile.code}_AROMATIC_PROFILE`,
    question_type: 'wine_aromatic_profile',
    wine_profile_code: profile.code,
    wine_profile_title: profile.title,
    question_text: `Classifica a presença das famílias aromáticas no perfil ${profile.code} — ${profile.title}.`,
    aromatic_families: AROMATIC_FAMILIES,
  }))
}
