export interface EmbeddingResult {
  vector: number[]
  dimensions: number
  provider: string
  model: string
  createdAt: string
}

export interface EmbeddingProvider {
  readonly provider: string
  readonly model: string
  readonly dimensions: number

  healthCheck(): Promise<boolean>

  generateEmbedding(
    text: string
  ): Promise<EmbeddingResult>

  generateEmbeddings(
    texts: string[]
  ): Promise<EmbeddingResult[]>
}
