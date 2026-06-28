import type { ConfidenceEngine } from './confidence-engine'
import type { ConfidenceResult } from './confidence-result'
import type { EvidenceSet } from '../retrieval/evidence-set'

export class ConfidenceEngineV1
  implements ConfidenceEngine
{
  evaluate(
    evidence: EvidenceSet
  ): ConfidenceResult {

    const score =
      evidence.averageConfidence

    const level =
      score >= 90
        ? 'very_high'
        : score >= 75
          ? 'high'
          : score >= 50
            ? 'medium'
            : 'low'

    const reasons: string[] = []

    if (evidence.evidence.length === 0) {
      reasons.push(
        'No evidence available.'
      )
    }

    if (
      evidence.evidence.length > 5
    ) {
      reasons.push(
        'Multiple evidence sources available.'
      )
    }

    if (score >= 75) {
      reasons.push(
        'High average evidence confidence.'
      )
    }

    return {
      score,
      level,
      reasons,
    }
  }
}
