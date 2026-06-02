export function extractSemanticAnswer(
  answer: any
): string {
  const json = answer.answer_json ?? {}

  if (json.value) {
    return json.value
  }

  if (json.similar_profile_code) {
    return `${json.similar_profile_code} (${json.similarity_degree ?? 'similar'})`
  }

  if (
    typeof answer.answer_text === 'string' &&
    answer.answer_text.trim().length > 0
  ) {
    return answer.answer_text
  }

  if (json.wine_profile_code) {
    return json.wine_profile_code
  }

  if (json.food_archetype_code) {
    return json.food_archetype_code
  }

  return 'unknown'
}
