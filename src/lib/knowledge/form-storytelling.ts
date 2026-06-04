export type KnowledgeFormStory = {
  formPhase: string
  title: string
  subtitle: string
  whyItMatters: string
  howToAnswer: string[]
  somasImpact: string
}

export const KNOWLEDGE_FORM_STORIES: KnowledgeFormStory[] = [
  {
    formPhase: 'pairing',
    title: 'Pairing Intelligence',
    subtitle: 'Arquétipos gastronómicos → perfis de vinho',
    whyItMatters:
      'Este módulo constrói a base principal da inteligência de harmonização do SomAS. Ao relacionar arquétipos gastronómicos com perfis vínicos, estamos a transformar conhecimento profissional em regras explicáveis e reutilizáveis.',
    howToAnswer: [
      'Pense no arquétipo, não num prato específico.',
      'Imagine a estrutura dominante: acidez, gordura, salinidade, intensidade, textura e método de confeção.',
      'Escolha os perfis de vinho que melhor equilibram ou valorizam esse arquétipo.',
      'Não procuramos uma resposta perfeita; procuramos padrões de consenso entre especialistas.',
    ],
    somasImpact:
      'As suas respostas ajudam o SomAS a recomendar estilos de vinho para pratos reais, cartas de restaurante e futuras experiências assistidas por IA.',
  },
  {
    formPhase: 'wine_identity',
    title: 'Wine Identity',
    subtitle: 'Perfis vínicos → regiões, estilos e relações',
    whyItMatters:
      'Este módulo ajuda o SomAS a compreender a identidade de cada perfil vínico. Queremos saber que regiões, castas, estilos internacionais e perfis semelhantes representam melhor cada WXX.',
    howToAnswer: [
      'Responda com associações naturais e reconhecíveis para um profissional de vinho.',
      'Quando possível, pense em regiões portuguesas, referências internacionais e estilos equivalentes.',
      'Se não tiver segurança absoluta, responda apenas aos perfis onde tem confiança.',
    ],
    somasImpact:
      'Este conhecimento permite explicar recomendações, criar pontes entre estilos e enriquecer a futura camada RAG do SomAS.',
  },
  {
    formPhase: 'wine_aromatic',
    title: 'Wine Aromatic Intelligence',
    subtitle: 'Perfis vínicos → famílias aromáticas',
    whyItMatters:
      'O vinho não é apenas estrutura. Os aromas são uma das dimensões mais importantes da perceção sensorial e da experiência de harmonização.',
    howToAnswer: [
      'Pense nos aromas dominantes de cada perfil WXX.',
      'Considere famílias como frutos vermelhos, frutos pretos, citrinos, tropicais, floral, herbal, mineral, tostado, especiarias, terroso e fumado.',
      'Avalie intensidade e presença aromática de forma prática, como faria numa prova profissional.',
    ],
    somasImpact:
      'As suas respostas ajudam a criar uma biblioteca aromática colaborativa para alimentar recomendações mais sensoriais, explicáveis e humanas.',
  },
  {
    formPhase: 'dish_intelligence',
    title: 'Dish Intelligence',
    subtitle: 'Pratos reais → arquétipos, confeção e perfil sensorial',
    whyItMatters:
      'Os arquétipos simplificam a gastronomia, mas o mundo real é feito de pratos concretos. Este módulo liga a teoria à prática.',
    howToAnswer: [
      'Indique pratos reais que representem bem cada arquétipo.',
      'Sempre que possível, pense em pratos portugueses e em diferentes métodos de confeção: cru, cozido, frito, grelhado, assado, estufado ou fumado.',
      'Avalie o prato pelo seu perfil sensorial: acidez, umami, salinidade, doçura, picante, gordura e intensidade.',
      'Evite pratos demasiado ambíguos se não tiver confiança na classificação.',
    ],
    somasImpact:
      'Este módulo permite ao SomAS reconhecer pratos reais, aproximá-los de arquétipos e recomendar perfis vínicos com maior precisão.',
  },
]

export function getKnowledgeFormStory(formPhase: string) {
  return KNOWLEDGE_FORM_STORIES.find(
    (story) => story.formPhase === formPhase
  )
}
