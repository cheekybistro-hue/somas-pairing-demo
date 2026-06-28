import type { DecisionType } from './decision-type'
import type { ConfidenceResult } from '../confidence/confidence-result'
import type { EvidenceSet } from '../retrieval/evidence-set'

export interface DecisionResult {
  id: string
  type: DecisionType
  title: string
  summary: string
  confidence: ConfidenceResult
  evidence: EvidenceSet
  createdAt: string
}
