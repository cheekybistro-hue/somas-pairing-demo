import type {
  EmbeddingProvider,
  EmbeddingResult,
} from '../embedding-provider'

type OpenAIEmbeddingResponse = {
  data: Array<{
    embedding: number[]
  }>
}

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  readonly provider = 'openai'
  readonly model: string
  readonly dimensions = 1536

  constructor(
    private readonly apiKey: string,
    model = 'text-embedding-3-small'
  ) {
    this.model = model
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.generateEmbedding('health check')
      return result.vector.length === this.dimensions
    } catch {
      return false
    }
  }

  async generateEmbedding(
    text: string
  ): Promise<EmbeddingResult> {
    const results = await this.generateEmbeddings([text])
    return results[0]
  }

  async generateEmbeddings(
    texts: string[]
  ): Promise<EmbeddingResult[]> {
    if (texts.length === 0) {
      return []
    }

    const response = await fetch(
      'https://api.openai.com/v1/embeddings',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          input: texts,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `OpenAI embedding request failed: ${response.status} ${errorText}`
      )
    }

    const payload =
      (await response.json()) as OpenAIEmbeddingResponse

    return payload.data.map((item) => ({
      vector: item.embedding,
      dimensions: item.embedding.length,
      provider: this.provider,
      model: this.model,
      createdAt: new Date().toISOString(),
    }))
  }
}
