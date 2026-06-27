import type {
  RetrievalEvidence,
} from './retrieval-result'

export type EvidenceSetStatus =
  | 'empty'
  | 'partial'
  | 'sufficient'
  | 'strong'

export interface EvidenceSet {
  id: string
  query: string
  evidence: RetrievalEvidence[]
  status: EvidenceSetStatus
  averageConfidence: number
  createdAt: string
}

export function buildEvidenceSet(
  query: string,
  evidence: RetrievalEvidence[]
): EvidenceSet {
  const confidenceValues = evidence
    .map((item) => item.confidence ?? item.similarity ?? 0)
    .filter((value) => value > 0)

  const averageConfidence =
    confidenceValues.length > 0
      ? Math.round(
          confidenceValues.reduce((sum, value) => sum + value, 0) /
            confidenceValues.length
        )
      : 0

  const status: EvidenceSetStatus =
    evidence.length === 0
      ? 'empty'
      : evidence.length < 3
        ? 'partial'
        : averageConfidence >= 80
          ? 'strong'
          : 'sufficient'

  return {
    id: `evidence-${Date.now()}`,
    query,
    evidence,
    status,
    averageConfidence,
    createdAt: new Date().toISOString(),
  }
}
