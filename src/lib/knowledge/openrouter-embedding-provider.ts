import type {
  GenerateEmbeddingInput,
  GenerateEmbeddingOutput,
  KnowledgeEmbeddingProvider,
} from './embedding-provider'

const DEFAULT_OPENROUTER_EMBEDDING_MODEL =
  'openai/text-embedding-3-small'

export class OpenRouterEmbeddingProvider
  implements KnowledgeEmbeddingProvider
{
  name = 'openrouter' as const

  private apiKey: string
  private model: string

  constructor(options?: {
    apiKey?: string
    model?: string
  }) {
    this.apiKey =
      options?.apiKey ??
      import.meta.env.VITE_OPENROUTER_API_KEY

    this.model =
      options?.model ??
      DEFAULT_OPENROUTER_EMBEDDING_MODEL
  }

  async generateEmbedding(
    input: GenerateEmbeddingInput
  ): Promise<GenerateEmbeddingOutput> {
    if (!this.apiKey) {
      throw new Error(
        'Missing VITE_OPENROUTER_API_KEY environment variable'
      )
    }

    const response = await fetch(
      'https://openrouter.ai/api/v1/embeddings',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer':
            'https://somaswinepairing.netlify.app',
          'X-Title': 'SomAS Wine Pairing',
        },
        body: JSON.stringify({
          model: this.model,
          input: input.content,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()

      throw new Error(
        `OpenRouter embedding request failed: ${response.status} ${errorText}`
      )
    }

    const payload = await response.json()

    const embedding =
      payload.data?.[0]?.embedding

    if (!Array.isArray(embedding)) {
      throw new Error(
        'OpenRouter embedding response did not contain an embedding array'
      )
    }

    return {
      embedding,
      model: this.model,
      dimensions: embedding.length,
    }
  }
}
