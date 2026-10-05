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
    subtitle: 'FORM1 · Arquétipos gastronómicos → perfis de vinho',
    whyItMatters:
      'Este formulário constrói a base principal da harmonização do SomAS. A pergunta não é “que vinho escolho para este prato?”, mas sim “que perfil vínico funciona melhor para este tipo de estrutura gastronómica?”. Assim transformamos conhecimento profissional em regras explicáveis e reutilizáveis.',
    howToAnswer: [
      'Leia primeiro o arquétipo Axx e o seu contexto sensorial: gordura, acidez, salinidade, textura, intensidade e método de confeção dominante.',
      'Não responda a pensar num prato único; responda a pensar no padrão gastronómico que esse arquétipo representa.',
      'Escolha o perfil Wxx que melhor equilibra, corta, acompanha ou valoriza esse arquétipo.',
      'Use os atributos para justificar a lógica da escolha: frescura, tanino, corpo, mineralidade, doçura, madeira, fruta, fumo ou estrutura.',
      'Use o comentário quando a escolha depender de uma nuance importante que outro especialista deva compreender.',
    ],
    somasImpact:
      'Estas respostas criam a matriz base prato-tipo → vinho-tipo. Mais tarde, quando um prato real for identificado, o SomAS consegue aproximá-lo de um arquétipo e recomendar perfis vínicos com uma explicação sensorial.',
  },
  {
    formPhase: 'wine_identity',
    title: 'Wine Identity',
    subtitle: 'FORM2 / FORM3 / FORM21 · Perfis vínicos → território, referências e relações',
    whyItMatters:
      'Depois de definir que perfil vínico combina com cada arquétipo, precisamos de dar identidade a esse perfil. Este formulário ajuda o SomAS a compreender onde esse estilo existe, que referências o explicam e que perfis estão próximos entre si.',
    howToAnswer: [
      'Quando a pergunta for nacional, indique a região portuguesa que melhor representa o perfil Wxx, não necessariamente uma marca ou vinho específico.',
      'Quando a pergunta for internacional, escolha regiões, castas ou estilos reconhecíveis que ajudem alguém a perceber rapidamente o perfil.',
      'Nas relações qualitativas, indique que outro perfil Wxx é sensorialmente semelhante e qual o grau dessa semelhança.',
      'Responda apenas quando a associação lhe parecer profissionalmente defensável; não é necessário forçar uma resposta perfeita.',
      'Use o comentário para explicar exceções, estilos híbridos ou diferenças regionais relevantes.',
    ],
    somasImpact:
      'Estas respostas permitem ao SomAS explicar recomendações com linguagem de vinho: regiões, castas, estilos equivalentes, alternativas e perfis próximos.',
  },
  {
    formPhase: 'wine_aromatic',
    title: 'Wine Aromatic Intelligence',
    subtitle: 'FORM4 · Perfis vínicos → famílias aromáticas',
    whyItMatters:
      'A estrutura do vinho explica parte da harmonização, mas a perceção aromática é decisiva na experiência. Este formulário cria uma biblioteca aromática colaborativa para cada perfil Wxx.',
    howToAnswer: [
      'Observe o perfil Wxx e avalie que famílias aromáticas são normalmente relevantes nesse estilo.',
      'Use a escala 0–5 de forma prática: 0 ausente, 1 muito subtil, 2 secundário, 3 claro, 4 marcante, 5 dominante.',
      'Não tente descrever um vinho concreto; descreva o comportamento aromático típico do perfil.',
      'Assinale apenas intensidades que fariam sentido numa prova profissional desse estilo.',
      'Use o comentário para explicar aromas dependentes de estágio, região, madeira, evolução ou método de produção.',
    ],
    somasImpact:
      'Estas respostas enriquecem as futuras recomendações e documentos RAG com pontes aromáticas: citrinos, floral, herbal, fruta madura, tostado, especiarias, mineralidade, terroso ou fumado.',
  },
  {
    formPhase: 'dish_intelligence',
    title: 'Dish Intelligence',
    subtitle: 'FORM5 · Pratos reais → arquétipos, confeção e perfil sensorial',
    whyItMatters:
      'Os arquétipos simplificam a gastronomia, mas o mundo real é feito de pratos concretos. Este formulário liga a teoria à prática: ajuda o SomAS a perceber como pratos reais se comportam sensorialmente.',
    howToAnswer: [
      'Indique um prato real que represente bem o arquétipo Axx apresentado no ecrã.',
      'Prefira pratos portugueses ou pratos que um chef/sommelier reconheça facilmente num contexto de restaurante.',
      'Escolha o método de confeção principal: cru, cozido, grelhado, assado, estufado, frito, fumado ou outro.',
      'Avalie o perfil sensorial do prato: intensidade, gordura/richness, acidez, doçura, salinidade, amargor, picante e umami.',
      'Não descreva uma receita completa; descreva o prato enquanto objeto de harmonização.',
    ],
    somasImpact:
      'Estas respostas permitem ao SomAS reconhecer pratos reais, aproximá-los de arquétipos gastronómicos e gerar recomendações mais úteis para menus, cartas e assistentes de IA.',
  },
]

export function getKnowledgeFormStory(formPhase: string) {
  return KNOWLEDGE_FORM_STORIES.find(
    (story) => story.formPhase === formPhase
  )
}
