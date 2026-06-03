type SearchResult = {
  id: string
  source: string
  sourceId: string
  content: string
  score: number
}

function buildSimilaritySection(
  results: SearchResult[]
) {
  const matches = results.filter(
    (item) =>
      item.content.includes(
        'qualitative relationship'
      )
  )

  if (matches.length === 0) {
    return null
  }

  return [
    'Perfis relacionados:',
    ...matches.map(
      (item) => `• ${item.content}`
    ),
  ].join('\n')
}

function buildRegionSection(
  results: SearchResult[]
) {
  const matches = results.filter(
    (item) =>
      item.content.includes(
        'associated with the Portuguese region'
      )
  )

  if (matches.length === 0) {
    return null
  }

  return [
    'Regiões identificadas:',
    ...matches.map(
      (item) => `• ${item.content}`
    ),
  ].join('\n')
}

function buildIdentitySection(
  results: SearchResult[]
) {
  const matches = results.filter(
    (item) =>
      item.content.includes(
        'international identity'
      )
  )

  if (matches.length === 0) {
    return null
  }

  return [
    'Identidades internacionais:',
    ...matches.map(
      (item) => `• ${item.content}`
    ),
  ].join('\n')
}

export function buildKnowledgeAnswer(
  question: string,
  results: SearchResult[]
) {
  if (results.length === 0) {
    return 'Não encontrei conhecimento relevante.'
  }

  const sections = [
    buildSimilaritySection(results),
    buildRegionSection(results),
    buildIdentitySection(results),
  ].filter(Boolean)

  return [
    `Pergunta: ${question}`,
    '',
    ...sections,
  ].join('\n\n')
}
