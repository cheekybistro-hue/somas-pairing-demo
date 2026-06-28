import type { EvidenceSet } from '../retrieval/evidence-set'
import type { ConfidenceResult } from './confidence-result'

export interface ConfidenceEngine {
  evaluate(
    evidence: EvidenceSet
  ): ConfidenceResult
}
