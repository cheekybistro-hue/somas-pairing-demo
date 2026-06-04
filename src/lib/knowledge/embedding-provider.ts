import { OpenRouterEmbeddingProvider } from './openrouter-embedding-provider'

export type EmbeddingProviderName =
  | 'mock'
  | 'openrouter'
  | 'ollama'
  | 'openai'

export type GenerateEmbeddingInput = {
  content: string
  model?: string
}

export type GenerateEmbeddingOutput = {
  embedding: number[]
  model: string
  dimensions: number
}

export interface KnowledgeEmbeddingProvider {
  name: EmbeddingProviderName

  generateEmbedding(
    input: GenerateEmbeddingInput
  ): Promise<GenerateEmbeddingOutput>
}

export class MockEmbeddingProvider
  implements KnowledgeEmbeddingProvider
{
  name: EmbeddingProviderName = 'mock'

  async generateEmbedding(
    input: GenerateEmbeddingInput
  ): Promise<GenerateEmbeddingOutput> {
    const dimensions = 16

    const embedding = Array.from(
      { length: dimensions },
      (_, index) => {
        const charCode =
          input.content.charCodeAt(
            index % Math.max(input.content.length, 1)
          ) || 0

        return Number(
          ((charCode % 100) / 100).toFixed(4)
        )
      }
    )

    return {
      embedding,
      model: input.model ?? 'mock-embedding-v1',
      dimensions,
    }
  }
}

export function createEmbeddingProvider(
  provider: EmbeddingProviderName = 'mock'
): KnowledgeEmbeddingProvider {
  if (provider === 'mock') {
    return new MockEmbeddingProvider()
  }
if (provider === 'openrouter') {
  return new OpenRouterEmbeddingProvider()
}
  throw new Error(
    `Embedding provider not implemented yet: ${provider}`
  )
}
