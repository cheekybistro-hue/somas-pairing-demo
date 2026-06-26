import type { EmbeddingProvider } from '../providers/embedding-provider'
import { OpenAIEmbeddingProvider } from '../providers/openai/openai-embedding-provider'

export type EmbeddingProviderType =
  | 'openai'
  | 'openrouter'
  | 'ollama'

export type EmbeddingProviderOptions = {
  provider: EmbeddingProviderType
  apiKey?: string
  model?: string
}

export function createEmbeddingProvider(
  options: EmbeddingProviderOptions
): EmbeddingProvider {
  switch (options.provider) {
    case 'openai':
      if (!options.apiKey) {
        throw new Error(
          'OpenAI API key is required.'
        )
      }

      return new OpenAIEmbeddingProvider(
        options.apiKey,
        options.model
      )

    case 'openrouter':
      throw new Error(
        'OpenRouter embedding provider not implemented.'
      )

    case 'ollama':
      throw new Error(
        'Ollama embedding provider not implemented.'
      )

    default:
      throw new Error(
        'Unsupported embedding provider.'
      )
  }
}
