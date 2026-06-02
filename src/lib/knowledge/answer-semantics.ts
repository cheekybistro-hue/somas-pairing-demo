export function extractSemanticAnswer(
  answer: any
): string {
  const json = answer.answer_json ?? {}

  if (json.region_name) {
    return json.region_name
  }

  if (json.identity_name) {
    return json.identity_name
  }

  if (json.relationship_name) {
    return json.relationship_name
  }

  if (json.wine_profile_name) {
    return json.wine_profile_name
  }

  if (json.food_archetype_name) {
    return json.food_archetype_name
  }

  if (
    typeof answer.answer_text === 'string' &&
    answer.answer_text.trim().length > 0
  ) {
    return answer.answer_text
  }

  return (
    json.wine_profile_code ??
    json.food_archetype_code ??
    'unknown'
  )
}
