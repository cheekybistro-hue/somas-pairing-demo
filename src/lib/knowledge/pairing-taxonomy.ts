export type FoodArchetype = {
  code: string
  title: string
  description: string
  examples: string[]
  cookingMethods: string[]
  sensoryContext: string
}

export type WineProfile = {
  code: string
  title: string
  category: string
  description: string
  aromaticHints: string[]
}

export const FOOD_ARCHETYPES: FoodArchetype[] = [
  {
    code: 'A01',
    title: 'Cru / iodado / alta frescura / acidez marcada',
    description: 'Preparações cruas, marítimas, muito frescas e com acidez evidente.',
    examples: ['Ostras', 'Sashimi', 'Ceviche'],
    cookingMethods: ['cru', 'marinado'],
    sensoryContext: 'Alta frescura, salinidade, textura delicada e baixa gordura.',
  },
  {
    code: 'A02',
    title: 'Marisco ou peixe cozido delicado',
    description: 'Preparações de peixe ou marisco de textura suave, baixa gordura e pouca intensidade aromática.',
    examples: ['Pescada cozida', 'Linguado ao vapor', 'Bacalhau cozido'],
    cookingMethods: ['cozido', 'vapor', 'baixa temperatura'],
    sensoryContext: 'Textura suave, pouca gordura, delicadeza e perfil limpo.',
  },
  {
    code: 'A03',
    title: 'Peixe ou marisco grelhado',
    description: 'Peixe ou marisco com grelha, ligeira caramelização e intensidade média.',
    examples: ['Robalo grelhado', 'Dourada grelhada', 'Lulas grelhadas'],
    cookingMethods: ['grelhado'],
    sensoryContext: 'Maillard leve, salinidade, frescura e alguma estrutura.',
  },
  {
    code: 'A04',
    title: 'Peixe ou marisco rico em gordura',
    description: 'Peixe ou marisco com gordura, untuosidade ou molhos ricos.',
    examples: ['Salmão', 'Atum braseado', 'Arroz de marisco rico'],
    cookingMethods: ['grelhado', 'braseado', 'assado'],
    sensoryContext: 'Gordura, untuosidade, intensidade média/alta e necessidade de equilíbrio.',
  },
  {
    code: 'A05',
    title: 'Peixe ou marisco em molho ácido',
    description: 'Preparações de peixe ou marisco com tomate, citrinos, vinagre ou acidez dominante.',
    examples: ['Escabeche', 'Peixe em molho de tomate', 'Cataplana com tomate'],
    cookingMethods: ['estufado', 'marinado'],
    sensoryContext: 'Acidez marcada, salinidade e intensidade média.',
  },
  {
    code: 'A06',
    title: 'Ave ou proteína branca grelhada simples',
    description: 'Proteína branca simples, grelhada ou cozinhada com pouca gordura.',
    examples: ['Frango grelhado', 'Peru grelhado', 'Coelho simples'],
    cookingMethods: ['grelhado', 'assado simples'],
    sensoryContext: 'Textura magra, intensidade moderada e pouca untuosidade.',
  },
  {
    code: 'A07',
    title: 'Ave ou proteína branca com molho cremoso',
    description: 'Proteína branca acompanhada de molhos cremosos, manteiga, natas ou textura envolvente.',
    examples: ['Frango com natas', 'Peru com molho cremoso', 'Coelho com molho branco'],
    cookingMethods: ['estufado', 'assado', 'salteado'],
    sensoryContext: 'Cremosidade, gordura média e necessidade de frescura ou estrutura.',
  },
  {
    code: 'A08',
    title: 'Proteína branca fumada ou BBQ leve',
    description: 'Proteína branca com fumo, grelha marcada ou notas de barbecue ligeiras.',
    examples: ['Frango fumado', 'Peru fumado', 'Asas grelhadas'],
    cookingMethods: ['fumado', 'bbq', 'grelhado'],
    sensoryContext: 'Fumo leve, especiaria moderada e intensidade média.',
  },
  {
    code: 'A09',
    title: 'Proteína branca com especiaria ou picante',
    description: 'Proteína branca marcada por especiarias, picante ou condimentos aromáticos.',
    examples: ['Frango piri-piri', 'Caril de frango', 'Peru especiado'],
    cookingMethods: ['grelhado', 'estufado', 'salteado'],
    sensoryContext: 'Picante, especiarias, intensidade aromática e necessidade de equilíbrio.',
  },
  {
    code: 'A10',
    title: 'Carne vermelha grelhada',
    description: 'Carne vermelha grelhada, com textura firme, proteína marcada e Maillard evidente.',
    examples: ['Posta Mirandesa', 'Bife da vazia', 'Costeletão grelhado'],
    cookingMethods: ['grelhado'],
    sensoryContext: 'Proteína, gordura variável, Maillard e tanino potencialmente necessário.',
  },
  {
    code: 'A11',
    title: 'Carne vermelha com molho escuro ou redução',
    description: 'Carne vermelha com molho intenso, redução, jus ou notas caramelizadas.',
    examples: ['Bife com molho de vinho', 'Carne com redução', 'Vitela com molho escuro'],
    cookingMethods: ['grelhado', 'salteado', 'redução'],
    sensoryContext: 'Intensidade, molho escuro, umami e estrutura.',
  },
  {
    code: 'A12',
    title: 'Carne vermelha estufada ou cozinhada lentamente',
    description: 'Carnes cozinhadas lentamente, com textura macia e molho profundo.',
    examples: ['Carne estufada', 'Rabo de boi', 'Chambão estufado'],
    cookingMethods: ['estufado', 'cozinhado lentamente'],
    sensoryContext: 'Umami, colagénio, intensidade e profundidade.',
  },
  {
    code: 'A13',
    title: 'Carne de caça ou intensidade elevada',
    description: 'Carnes de caça ou pratos de grande intensidade aromática e sabor persistente.',
    examples: ['Javali', 'Veado', 'Perdiz estufada'],
    cookingMethods: ['estufado', 'assado'],
    sensoryContext: 'Intensidade alta, notas selvagens, terrosas e especiadas.',
  },
  {
    code: 'A14',
    title: 'Cogumelos / trufa / perfil terroso',
    description: 'Pratos dominados por cogumelos, trufa, terra húmida ou sabores de bosque.',
    examples: ['Risotto de cogumelos', 'Cogumelos salteados', 'Massa com trufa'],
    cookingMethods: ['salteado', 'estufado'],
    sensoryContext: 'Terroso, umami, textura média e intensidade aromática.',
  },
  {
    code: 'A15',
    title: 'Prato vegetal estruturado ou assado',
    description: 'Vegetais assados, grelhados ou estruturados, com doçura natural e textura firme.',
    examples: ['Legumes assados', 'Beringela assada', 'Couve-flor assada'],
    cookingMethods: ['assado', 'grelhado'],
    sensoryContext: 'Doçura vegetal, Maillard leve, textura e intensidade média.',
  },
  {
    code: 'A16',
    title: 'Vegetal fresco com acidez dominante',
    description: 'Preparações vegetais frescas, ácidas, crocantes ou com vinagrete.',
    examples: ['Salada com vinagrete', 'Tomate temperado', 'Vegetais crus marinados'],
    cookingMethods: ['cru', 'marinado'],
    sensoryContext: 'Acidez, frescura, crocância e baixa gordura.',
  },
  {
    code: 'A17',
    title: 'Queijo fresco e suave',
    description: 'Queijos jovens, frescos, suaves e de baixa intensidade.',
    examples: ['Queijo fresco', 'Requeijão', 'Mozzarella fresca'],
    cookingMethods: ['sem confeção'],
    sensoryContext: 'Laticínio suave, frescura, salinidade baixa/média.',
  },
  {
    code: 'A18',
    title: 'Queijo curado de intensidade média',
    description: 'Queijos curados mas equilibrados, com gordura e salinidade moderadas.',
    examples: ['Queijo de ovelha curado', 'São Jorge jovem', 'Queijo curado médio'],
    cookingMethods: ['sem confeção'],
    sensoryContext: 'Gordura, sal, intensidade média e persistência.',
  },
  {
    code: 'A19',
    title: 'Queijo curado intenso / salgado',
    description: 'Queijos muito curados, intensos, salgados ou picantes.',
    examples: ['Queijo da Serra curado', 'São Jorge velho', 'Queijo azul'],
    cookingMethods: ['sem confeção'],
    sensoryContext: 'Salinidade alta, gordura, intensidade e persistência longa.',
  },
  {
    code: 'A20',
    title: 'Sobremesa leve e pouco doce',
    description: 'Sobremesas delicadas, pouco doces, leves e de baixa intensidade.',
    examples: ['Pudim leve', 'Panna cotta suave', 'Bolo simples pouco doce'],
    cookingMethods: ['doçaria'],
    sensoryContext: 'Doçura baixa/média, textura leve e intensidade moderada.',
  },
  {
    code: 'A21',
    title: 'Sobremesa cítrica ou frutada',
    description: 'Sobremesas dominadas por fruta, citrinos, frescura ou acidez.',
    examples: ['Tarte de limão', 'Salada de fruta', 'Tarte de maçã'],
    cookingMethods: ['doçaria'],
    sensoryContext: 'Fruta, acidez, frescura e doçura equilibrada.',
  },
  {
    code: 'A22',
    title: 'Sobremesa rica em chocolate ou caramelo',
    description: 'Sobremesas densas, doces e marcadas por chocolate, caramelo ou frutos secos.',
    examples: ['Mousse de chocolate', 'Brownie', 'Pudim de caramelo'],
    cookingMethods: ['doçaria'],
    sensoryContext: 'Doçura alta, amargor possível, gordura e intensidade.',
  },
  {
    code: 'A23',
    title: 'Sobremesa doce intensa / alcoólica',
    description: 'Sobremesas muito doces, alcoólicas, fortificadas ou de grande concentração.',
    examples: ['Pão de ló húmido', 'Toucinho do céu', 'Sobremesa com vinho do Porto'],
    cookingMethods: ['doçaria'],
    sensoryContext: 'Doçura elevada, riqueza, persistência e intensidade alta.',
  },
  {
    code: 'A24',
    title: 'Prato com picante dominante',
    description: 'Pratos onde o picante é o elemento dominante da experiência.',
    examples: ['Caril picante', 'Frango piri-piri intenso', 'Prato com malagueta dominante'],
    cookingMethods: ['grelhado', 'estufado', 'salteado'],
    sensoryContext: 'Picante alto, intensidade aromática e necessidade de frescura/doçura.',
  },
  {
    code: 'A25',
    title: 'Prato com fumo dominante / BBQ intenso',
    description: 'Pratos fortemente marcados por fumo, carvão, barbecue ou tostados intensos.',
    examples: ['Entremeada BBQ', 'Costelas fumadas', 'Carne no carvão'],
    cookingMethods: ['fumado', 'bbq', 'grelhado intenso'],
    sensoryContext: 'Fumo, tostado, gordura e intensidade elevada.',
  },
]

export const WINE_PROFILES: WineProfile[] = [
  { code: 'W01', category: 'Brancos', title: 'Branco leve, alta acidez, mineral', description: 'Perfil branco fresco, leve, mineral e de acidez marcada.', aromaticHints: ['citrinos', 'mineral', 'floral leve'] },
  { code: 'W02', category: 'Brancos', title: 'Branco aromático floral', description: 'Branco expressivo, floral e perfumado.', aromaticHints: ['floral', 'fruta branca', 'citrinos'] },
  { code: 'W03', category: 'Brancos', title: 'Branco cítrico com textura média', description: 'Branco fresco mas com alguma textura e presença.', aromaticHints: ['citrinos', 'fruta de caroço', 'mineral'] },
  { code: 'W04', category: 'Brancos', title: 'Branco estruturado sem madeira', description: 'Branco com corpo e estrutura, sem influência evidente de madeira.', aromaticHints: ['fruta madura', 'mineral', 'ervas'] },
  { code: 'W05', category: 'Brancos', title: 'Branco com madeira integrada', description: 'Branco estruturado com madeira bem integrada.', aromaticHints: ['baunilha', 'tosta', 'fruta madura'] },
  { code: 'W06', category: 'Brancos', title: 'Branco de curtimenta', description: 'Branco com contacto pelicular, textura e perfil mais fenólico.', aromaticHints: ['casca de fruta', 'chá', 'especiarias'] },
  { code: 'W07', category: 'Espumantes', title: 'Espumante bruto seco', description: 'Espumante seco, fresco e vibrante.', aromaticHints: ['citrinos', 'pão tostado', 'mineral'] },
  { code: 'W08', category: 'Espumantes', title: 'Espumante estruturado', description: 'Espumante com corpo, complexidade e persistência.', aromaticHints: ['brioche', 'fruta madura', 'tosta'] },
  { code: 'W09', category: 'Espumantes', title: 'Espumante meio seco', description: 'Espumante com doçura perceptível e perfil acessível.', aromaticHints: ['fruta madura', 'mel', 'floral'] },
  { code: 'W10', category: 'Rosé', title: 'Rosé leve', description: 'Rosé fresco, leve e frutado.', aromaticHints: ['morango', 'framboesa', 'floral'] },
  { code: 'W11', category: 'Rosé', title: 'Rosé estruturado', description: 'Rosé com maior corpo, textura e intensidade.', aromaticHints: ['frutos vermelhos', 'especiarias leves', 'citrinos'] },
  { code: 'W12', category: 'Tintos', title: 'Tinto leve alta acidez', description: 'Tinto leve, fresco, com acidez viva e tanino baixo.', aromaticHints: ['cereja', 'framboesa', 'floral'] },
  { code: 'W13', category: 'Tintos', title: 'Tinto médio fresco', description: 'Tinto de corpo médio, fresco e versátil.', aromaticHints: ['frutos vermelhos', 'erva seca', 'especiarias'] },
  { code: 'W14', category: 'Tintos', title: 'Tinto frutado', description: 'Tinto marcado por fruta expressiva e acessível.', aromaticHints: ['frutos vermelhos', 'frutos pretos', 'ameixa'] },
  { code: 'W15', category: 'Tintos', title: 'Tinto vegetal/herbal', description: 'Tinto com notas verdes, herbais ou vegetais.', aromaticHints: ['pimento', 'erva', 'folha de tomate'] },
  { code: 'W16', category: 'Tintos', title: 'Tinto elegante com madeira', description: 'Tinto elegante, polido e com madeira integrada.', aromaticHints: ['frutos vermelhos', 'baunilha', 'especiarias'] },
  { code: 'W17', category: 'Tintos', title: 'Tinto estruturado', description: 'Tinto com corpo, tanino e intensidade.', aromaticHints: ['frutos pretos', 'especiarias', 'mineral'] },
  { code: 'W18', category: 'Tintos', title: 'Tinto estruturado com madeira', description: 'Tinto intenso, estruturado e com madeira evidente mas integrada.', aromaticHints: ['frutos pretos', 'tosta', 'baunilha'] },
  { code: 'W19', category: 'Tintos', title: 'Tinto potente', description: 'Tinto de grande corpo, concentração e intensidade.', aromaticHints: ['amora', 'licoroso', 'especiarias doces'] },
  { code: 'W20', category: 'Tintos', title: 'Tinto terroso', description: 'Tinto marcado por notas terrosas, bosque ou cogumelos.', aromaticHints: ['terra', 'cogumelos', 'folha seca'] },
  { code: 'W21', category: 'Tintos', title: 'Tinto elegante premium', description: 'Tinto complexo, elegante, profundo e persistente.', aromaticHints: ['fruta fina', 'especiarias', 'floral'] },
  { code: 'W22', category: 'Tintos', title: 'Tinto fumado', description: 'Tinto com notas fumadas, tostadas ou de barrica marcada.', aromaticHints: ['fumo', 'tosta', 'cacau'] },
  { code: 'W23', category: 'Especiais', title: 'Vinho de talha', description: 'Perfil tradicional de talha, textura e carácter oxidativo ou terroso.', aromaticHints: ['barro', 'fruta seca', 'especiarias'] },
  { code: 'W24', category: 'Especiais', title: 'Branco doce', description: 'Vinho branco doce com frescura e perfil aromático.', aromaticHints: ['mel', 'fruta madura', 'floral'] },
  { code: 'W25', category: 'Especiais', title: 'Licoroso', description: 'Vinho fortificado ou licoroso de grande intensidade.', aromaticHints: ['frutos secos', 'caramelo', 'especiarias'] },
  { code: 'W26', category: 'Especiais', title: 'Porto Ruby', description: 'Vinho do Porto Ruby, frutado, doce e intenso.', aromaticHints: ['cereja', 'amora', 'chocolate'] },
  { code: 'W27', category: 'Referências', title: 'Branco estilo Borgonha', description: 'Referência internacional para branco estruturado, elegante e textural.', aromaticHints: ['manteiga', 'avelã', 'fruta madura'] },
  { code: 'W28', category: 'Referências', title: 'Tinto estilo Bordéus', description: 'Referência internacional para tinto estruturado, elegante e com tanino.', aromaticHints: ['cassis', 'cedro', 'grafite'] },
  { code: 'W29', category: 'Referências', title: 'Tinto estilo Piemonte', description: 'Referência internacional para tinto elegante, ácido, taninoso e floral.', aromaticHints: ['rosa', 'cereja', 'alcatrão'] },
  { code: 'W30', category: 'Referências', title: 'Branco estilo Riesling', description: 'Referência internacional para branco aromático, ácido e mineral.', aromaticHints: ['lima', 'petróleo', 'floral'] },
]

export function getFoodArchetype(code: string) {
  return FOOD_ARCHETYPES.find((item) => item.code === code)
}

export function getWineProfile(code: string) {
  return WINE_PROFILES.find((item) => item.code === code)
}
