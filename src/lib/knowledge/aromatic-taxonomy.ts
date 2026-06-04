export type AromaticFamily = {
  code: string
  name: string
  description: string
  examples: string[]
}

export const AROMATIC_FAMILIES: AromaticFamily[] = [
  {
    code: 'AF01',
    name: 'Frutos Vermelhos',
    description: 'Aromas associados a frutos vermelhos frescos.',
    examples: ['Morango', 'Framboesa', 'Cereja'],
  },
  {
    code: 'AF02',
    name: 'Frutos Pretos',
    description: 'Aromas associados a frutos pretos maduros.',
    examples: ['Amora', 'Mirtilo', 'Cassis'],
  },
  {
    code: 'AF03',
    name: 'Cítricos',
    description: 'Aromas de limão, lima, toranja e outros citrinos.',
    examples: ['Limão', 'Lima', 'Toranja'],
  },
  {
    code: 'AF04',
    name: 'Fruta Tropical',
    description: 'Aromas de fruta tropical madura.',
    examples: ['Ananás', 'Manga', 'Maracujá'],
  },
  {
    code: 'AF05',
    name: 'Fruta de Caroço',
    description: 'Aromas de pêssego, alperce e nectarina.',
    examples: ['Pêssego', 'Alperce', 'Nectarina'],
  },
  {
    code: 'AF06',
    name: 'Floral',
    description: 'Notas florais delicadas ou exuberantes.',
    examples: ['Rosa', 'Flor de laranjeira', 'Jasmim'],
  },
  {
    code: 'AF07',
    name: 'Herbal',
    description: 'Notas vegetais, ervas e aromáticas.',
    examples: ['Hortelã', 'Tomilho', 'Erva fresca'],
  },
  {
    code: 'AF08',
    name: 'Mineral',
    description: 'Notas minerais ou de pedra molhada.',
    examples: ['Sílex', 'Pedra molhada', 'Giz'],
  },
  {
    code: 'AF09',
    name: 'Tostado',
    description: 'Notas de barrica, pão torrado ou brioche.',
    examples: ['Brioche', 'Pão torrado', 'Tosta'],
  },
  {
    code: 'AF10',
    name: 'Baunilha',
    description: 'Notas doces associadas à madeira.',
    examples: ['Baunilha', 'Creme', 'Caramelo leve'],
  },
  {
    code: 'AF11',
    name: 'Especiarias',
    description: 'Notas de especiarias doces ou secas.',
    examples: ['Pimenta', 'Canela', 'Cravinho'],
  },
  {
    code: 'AF12',
    name: 'Terroso',
    description: 'Notas de terra, floresta ou cogumelos.',
    examples: ['Terra húmida', 'Cogumelos', 'Folha seca'],
  },
  {
    code: 'AF13',
    name: 'Fumado',
    description: 'Notas de fumo, carvão ou madeira queimada.',
    examples: ['Fumo', 'Carvão', 'Madeira queimada'],
  },
]

export function getAromaticFamily(
  code: string
) {
  return AROMATIC_FAMILIES.find(
    (item) => item.code === code
  )
}
