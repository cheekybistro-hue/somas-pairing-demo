export interface RetrievalRequest {
  query: string

  limit: number

  minimumSimilarity?: number
}
