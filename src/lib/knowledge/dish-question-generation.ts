import { FOOD_ARCHETYPES } from './pairing-taxonomy'

export const DISH_INTELLIGENCE_FORM_PHASE =
  'dish_intelligence'

export const DISH_INTELLIGENCE_MODULE = {
  module_code: 'FORM5',
  module_name: 'Dish Intelligence',
  description:
    'Pratos reais, métodos de confeção e perfil sensorial gastronómico.',
  form_phase: DISH_INTELLIGENCE_FORM_PHASE,
  sort_order: 6,
  active: true,
}

export function buildDishIntelligenceQuestions() {
  return FOOD_ARCHETYPES.map((archetype, index) => ({
    question_code: `${archetype.code}_DISH_INTELLIGENCE`,
    form_phase: DISH_INTELLIGENCE_FORM_PHASE,
    question_type: 'dish_intelligence',
    food_archetype_code: archetype.code,
    wine_profile_code: null,
    question_text: `Indique um prato real que represente o arquétipo ${archetype.code} — ${archetype.title}.`,
    helper_text: archetype.sensoryContext,
    priority: (index + 1) * 10,
    active: true,
  }))
}
