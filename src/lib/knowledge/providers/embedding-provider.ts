export interface EmbeddingResult {
  /**
   * Generated embedding vector.
   */
  vector: number[]

  /**
   * Vector dimensions.
   */
  dimensions: number

  /**
   * Provider that generated the embedding.
   */
  provider: string

  /**
   * Model used to generate the embedding.
   */
  model: string
}

export interface EmbeddingProvider {
  /**
   * Provider identifier.
   * Examples:
   * - openai
   * - openrouter
   * - ollama
   */
  readonly provider: string

  /**
   * Model identifier.
   * Example:
   * text-embedding-3-small
   */
  readonly model: string

  /**
   * Embedding vector dimensions.
   */
  readonly dimensions: number

  /**
   * Generate a single embedding.
   */
  generateEmbedding(
    text: string
  ): Promise<EmbeddingResult>

  /**
   * Generate embeddings in batch.
   */
  generateEmbeddings(
    texts: string[]
  ): Promise<EmbeddingResult[]>
}
