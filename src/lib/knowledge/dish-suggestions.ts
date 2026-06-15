export type DishSuggestion = {
  name: string
  cookingMethod: string
  origin: 'Portugal' | 'Internacional'
}

export const DISH_SUGGESTIONS: Record<string, DishSuggestion[]> = {
  A01: [
    { name: 'Ostras da Ria Formosa', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Percebes cozidos', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Amêijoas à Bulhão Pato', cookingMethod: 'Salteado', origin: 'Portugal' },
    { name: 'Ceviche peruano', cookingMethod: 'Marinado', origin: 'Internacional' },
  ],

  A02: [
    { name: 'Bacalhau cozido com todos', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Pescada cozida', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Linguado ao vapor', cookingMethod: 'Vapor', origin: 'Portugal' },
    { name: 'Sole meunière', cookingMethod: 'Salteado', origin: 'Internacional' },
  ],

  A03: [
    { name: 'Sardinha assada', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Dourada grelhada', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Polvo grelhado', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Gambas al ajillo', cookingMethod: 'Salteado', origin: 'Internacional' },
  ],

  A04: [
    { name: 'Bacalhau com natas', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Arroz de marisco', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Cataplana de peixe', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Salmão com molho holandês', cookingMethod: 'Grelhado', origin: 'Internacional' },
  ],

  A05: [
    { name: 'Escabeche de peixe', cookingMethod: 'Marinado', origin: 'Portugal' },
    { name: 'Salada de polvo', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Mexilhão de escabeche', cookingMethod: 'Marinado', origin: 'Portugal' },
    { name: 'Boquerones en vinagre', cookingMethod: 'Marinado', origin: 'Internacional' },
  ],

  A06: [
    { name: 'Frango grelhado', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Peru assado simples', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Coelho grelhado', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Poulet rôti', cookingMethod: 'Assado', origin: 'Internacional' },
  ],

  A07: [
    { name: 'Frango de fricassé', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Arroz de pato', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Galinha de cabidela', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Coq au vin', cookingMethod: 'Estufado', origin: 'Internacional' },
  ],

  A08: [
    { name: 'Entrecosto assado', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Frango no churrasco', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Costeletas grelhadas', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Costelas barbecue', cookingMethod: 'Fumado', origin: 'Internacional' },
  ],

  A09: [
    { name: 'Frango piri-piri', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Caril de gambas', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Moelas picantes', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Chicken tikka masala', cookingMethod: 'Estufado', origin: 'Internacional' },
  ],

  A10: [
    { name: 'Posta mirandesa', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Bife à portuguesa', cookingMethod: 'Frito', origin: 'Portugal' },
    { name: 'Costeleta de novilho grelhada', cookingMethod: 'Grelhado', origin: 'Portugal' },
    { name: 'Chuletón basco', cookingMethod: 'Grelhado', origin: 'Internacional' },
  ],

  A11: [
    { name: 'Vitela de Lafões', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Bochechas de porco estufadas', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Rabo de boi estufado', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Ossobuco alla milanese', cookingMethod: 'Estufado', origin: 'Internacional' },
  ],

  A12: [
    { name: 'Cabrito assado', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Leitão da Bairrada', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Cozido à portuguesa', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Cassoulet', cookingMethod: 'Estufado', origin: 'Internacional' },
  ],

  A13: [
    { name: 'Arroz de cabidela de caça', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Javali estufado', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Perdiz de escabeche', cookingMethod: 'Marinado', origin: 'Portugal' },
    { name: 'Civet de lièvre', cookingMethod: 'Estufado', origin: 'Internacional' },
  ],

  A14: [
    { name: 'Arroz de míscaros', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Cogumelos salteados', cookingMethod: 'Salteado', origin: 'Portugal' },
    { name: 'Açorda de cogumelos', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Risotto de funghi', cookingMethod: 'Estufado', origin: 'Internacional' },
  ],

  A15: [
    { name: 'Legumes assados no forno', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Peixinhos da horta', cookingMethod: 'Frito', origin: 'Portugal' },
    { name: 'Migas com legumes', cookingMethod: 'Salteado', origin: 'Portugal' },
    { name: 'Ratatouille', cookingMethod: 'Estufado', origin: 'Internacional' },
  ],

  A16: [
    { name: 'Salada de tomate algarvia', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Salada de polvo fria', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Gaspacho alentejano', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Salada grega', cookingMethod: 'Cru', origin: 'Internacional' },
  ],

  A17: [
    { name: 'Queijo fresco com azeite', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Requeijão com ervas', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Queijo de cabra fresco', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Burrata', cookingMethod: 'Cru', origin: 'Internacional' },
  ],

  A18: [
    { name: 'Queijo Serra da Estrela jovem', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Queijo de Azeitão', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Queijo de Nisa', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Comté jovem', cookingMethod: 'Cru', origin: 'Internacional' },
  ],

  A19: [
    { name: 'Queijo São Jorge curado', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Queijo da Ilha curado', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Serpa curado', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Roquefort', cookingMethod: 'Cru', origin: 'Internacional' },
  ],

  A20: [
    { name: 'Paté de fígado', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Terrina de caça', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Morcela assada', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Foie gras', cookingMethod: 'Cru', origin: 'Internacional' },
  ],

  A21: [
    { name: 'Empadão de carne', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Rissóis de carne', cookingMethod: 'Frito', origin: 'Portugal' },
    { name: 'Croquetes de carne', cookingMethod: 'Frito', origin: 'Portugal' },
    { name: 'Lasagna alla bolognese', cookingMethod: 'Assado', origin: 'Internacional' },
  ],

  A22: [
    { name: 'Arroz de marisco', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Arroz de polvo', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Arroz de tamboril', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Paella valenciana', cookingMethod: 'Estufado', origin: 'Internacional' },
  ],

  A23: [
    { name: 'Massa à lavrador', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Massa de peixe', cookingMethod: 'Estufado', origin: 'Portugal' },
    { name: 'Massa gratinada com carne', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Spaghetti carbonara', cookingMethod: 'Salteado', origin: 'Internacional' },
  ],

  A24: [
    { name: 'Pastel de nata', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Leite creme', cookingMethod: 'Cozido', origin: 'Portugal' },
    { name: 'Tarte de maçã', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Crème brûlée', cookingMethod: 'Cozido', origin: 'Internacional' },
  ],

  A25: [
    { name: 'Mousse de chocolate', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Bolo de chocolate', cookingMethod: 'Assado', origin: 'Portugal' },
    { name: 'Salame de chocolate', cookingMethod: 'Cru', origin: 'Portugal' },
    { name: 'Fondant au chocolat', cookingMethod: 'Assado', origin: 'Internacional' },
  ],
}
