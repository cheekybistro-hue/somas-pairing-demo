export type DishSuggestion = {
  name: string
  cookingMethod: string
  origin: 'Portugal' | 'Internacional'
}

// PR12.2 — Dish Intelligence suggestions aligned with FOOD_ARCHETYPES.
// Ground rules:
// - Portuguese dishes only for now.
// - Suggestions must represent the sensory archetype, not just the ingredient.
// - International examples can return later as a separate optional layer.
// - A20–A23 are dessert archetypes in the current pairing taxonomy.
// - A24 is dominant spice/heat.
// - A25 is dominant smoke / intense BBQ in the current pairing taxonomy.
export const DISH_SUGGESTIONS: Record<string, DishSuggestion[]> = {
  A01: [
    { name: 'Ostras da Ria Formosa', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Percebes cozidos', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Berbigão ao natural', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Amêijoas à Bulhão Pato', cookingMethod: 'Salteado', origin: 'Portugal' },
  ],

  A02: [
    { name: 'Pescada cozida simples', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Linguado ao vapor', cookingMethod: 'Vapor', origin: 'Portugal' },
    { name: 'Robalo cozido simples', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Dourada ao vapor', cookingMethod: 'Vapor', origin: 'Portugal' },
  ],

  A03: [
    { name: 'Robalo grelhado', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Dourada grelhada', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Lulas grelhadas', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Sardinha assada', cookingMethod: 'Grelhado', origin: 'Portugal' },
  ],

  A04: [
    { name: 'Bacalhau com natas', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Arroz de marisco', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Cataplana de peixe', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Polvo à lagareiro', cookingMethod: 'Assado', origin: 'Portugal' },
  ],

  A05: [
    { name: 'Escabeche de peixe', cookingMethod: 'Marinado', origin: 'Portugal' },
    { name: 'Carapaus de escabeche', cookingMethod: 'Marinado', origin: 'Portugal' },
    { name: 'Cataplana de peixe com tomate', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Salada de polvo com vinagrete', cookingMethod: 'Cozido', origin: 'Portugal' },
  ],

  A06: [
    { name: 'Frango grelhado simples', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Peru grelhado', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Coelho grelhado', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Bife de peru grelhado', cookingMethod: 'Grelhado', origin: 'Portugal' },
  ],

  A07: [
    { name: 'Frango de fricassé', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Frango com natas', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Coelho com molho branco', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Peru com molho cremoso', cookingMethod: 'Estufado', origin: 'Portugal' },
  ],

  A08: [
    { name: 'Frango no churrasco', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Asas de frango grelhadas', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Frango fumado', cookingMethod: 'Fumado', origin: 'Portugal' },
    { name: 'Peru fumado', cookingMethod: 'Fumado', origin: 'Portugal' },
  ],

  A09: [
    { name: 'Frango piri-piri', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Caril de frango', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Moelas picantes', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Camarão picante', cookingMethod: 'Salteado', origin: 'Portugal' },
  ],

  A10: [
    { name: 'Posta mirandesa', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Bife à portuguesa', cookingMethod: 'Frito', origin: 'Portugal' },
    { name: 'Costeleta de novilho grelhada', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Naco de vitela grelhado', cookingMethod: 'Grelhado', origin: 'Portugal' },
  ],

  A11: [
    { name: 'Bife com molho de vinho tinto', cookingMethod: 'Redução', origin: 'Portugal' },
    { name: 'Bife com molho de pimenta', cookingMethod: 'Salteado', origin: 'Portugal' },
    { name: 'Vitela com molho escuro', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Bochechas de porco com redução', cookingMethod: 'Estufado', origin: 'Portugal' },
  ],

  A12: [
    { name: 'Carne de vaca estufada', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Rabo de boi estufado', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Chambão de vitela estufado', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Ensopado de borrego', cookingMethod: 'Estufado', origin: 'Portugal' },
  ],

  A13: [
    { name: 'Javali estufado', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Veado estufado', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Perdiz de escabeche', cookingMethod: 'Marinado', origin: 'Portugal' },
    { name: 'Arroz de cabidela de caça', cookingMethod: 'Estufado', origin: 'Portugal' },
  ],

  A14: [
    { name: 'Arroz de míscaros', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Cogumelos salteados', cookingMethod: 'Salteado', origin: 'Portugal' },
    { name: 'Açorda de cogumelos', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Ovos mexidos com cogumelos', cookingMethod: 'Salteado', origin: 'Portugal' },
  ],

  A15: [
    { name: 'Legumes assados no forno', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Peixinhos da horta', cookingMethod: 'Frito', origin: 'Portugal' },
    { name: 'Migas com legumes', cookingMethod: 'Salteado', origin: 'Portugal' },
    { name: 'Beringela assada', cookingMethod: 'Assado', origin: 'Portugal' },
  ],

  A16: [
    { name: 'Salada de tomate algarvia', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Gaspacho alentejano', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Salada de pimentos assados com vinagrete', cookingMethod: 'Marinado', origin: 'Portugal' },
    { name: 'Vegetais crus marinados', cookingMethod: 'Marinado', origin: 'Portugal' },
  ],

  A17: [
    { name: 'Queijo fresco', cookingMethod: 'Sem confeção', origin: 'Portugal' },
    { name: 'Requeijão', cookingMethod: 'Sem confeção', origin: 'Portugal' },
    { name: 'Queijo de cabra fresco', cookingMethod: 'Sem confeção', origin: 'Portugal' },
    { name: 'Requeijão com ervas', cookingMethod: 'Sem confeção', origin: 'Portugal' },
  ],

  A18: [
    { name: 'Queijo de Azeitão', cookingMethod: 'Sem confeção', origin: 'Portugal' },
    { name: 'Queijo de Nisa', cookingMethod: 'Sem confeção', origin: 'Portugal' },
    { name: 'Queijo Serra da Estrela jovem', cookingMethod: 'Sem confeção', origin: 'Portugal' },
    { name: 'Queijo São Jorge jovem', cookingMethod: 'Sem confeção', origin: 'Portugal' },
  ],

  A19: [
    { name: 'Queijo São Jorge curado', cookingMethod: 'Sem confeção', origin: 'Portugal' },
    { name: 'Queijo da Ilha curado', cookingMethod: 'Sem confeção', origin: 'Portugal' },
    { name: 'Serpa curado', cookingMethod: 'Sem confeção', origin: 'Portugal' },
    { name: 'Queijo Serra da Estrela curado', cookingMethod: 'Sem confeção', origin: 'Portugal' },
  ],

  A20: [
    { name: 'Arroz doce pouco doce', cookingMethod: 'Doçaria', origin: 'Portugal' },
    { name: 'Aletria leve', cookingMethod: 'Doçaria', origin: 'Portugal' },
    { name: 'Pudim de claras', cookingMethod: 'Doçaria', origin: 'Portugal' },
    { name: 'Bolo de iogurte simples', cookingMethod: 'Assado', origin: 'Portugal' },
  ],

  A21: [
    { name: 'Tarte de limão', cookingMethod: 'Doçaria', origin: 'Portugal' },
    { name: 'Bolo de laranja', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Salada de fruta', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Maçã assada', cookingMethod: 'Assado', origin: 'Portugal' },
  ],

  A22: [
    { name: 'Mousse de chocolate', cookingMethod: 'Doçaria', origin: 'Portugal' },
    { name: 'Bolo de chocolate', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Salame de chocolate', cookingMethod: 'Doçaria', origin: 'Portugal' },
    { name: 'Pudim de ovos com caramelo', cookingMethod: 'Doçaria', origin: 'Portugal' },
  ],

  A23: [
    { name: 'Pão de ló húmido', cookingMethod: 'Doçaria', origin: 'Portugal' },
    { name: 'Toucinho do céu', cookingMethod: 'Doçaria', origin: 'Portugal' },
    { name: 'Ovos moles de Aveiro', cookingMethod: 'Doçaria', origin: 'Portugal' },
    { name: 'Rabanadas com vinho do Porto', cookingMethod: 'Doçaria', origin: 'Portugal' },
  ],

  A24: [
    { name: 'Frango piri-piri intenso', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Moelas picantes', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Caril de frango picante', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Camarão com malagueta', cookingMethod: 'Salteado', origin: 'Portugal' },
  ],

  A25: [
    { name: 'Entremeada no carvão', cookingMethod: 'Grelhado intenso', origin: 'Portugal' },
    { name: 'Costelinhas fumadas', cookingMethod: 'Fumado', origin: 'Portugal' },
    { name: 'Secretos de porco no carvão', cookingMethod: 'Grelhado intenso', origin: 'Portugal' },
    { name: 'Churrasco misto fumado', cookingMethod: 'Fumado', origin: 'Portugal' },
  ],
}
