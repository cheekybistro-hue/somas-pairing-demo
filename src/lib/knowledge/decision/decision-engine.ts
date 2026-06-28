import type { EvidenceSet } from '../retrieval/evidence-set'
import type { ConfidenceResult } from '../confidence/confidence-result'
import type { DecisionResult } from './decision-result'

export interface DecisionEngine {
  decide(
    evidence: EvidenceSet,
    confidence: ConfidenceResult
  ): DecisionResult
}
