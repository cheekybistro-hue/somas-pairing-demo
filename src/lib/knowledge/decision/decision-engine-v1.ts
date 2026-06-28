import type { DecisionEngine } from './decision-engine'
import type { DecisionResult } from './decision-result'
import type { ConfidenceResult } from '../confidence/confidence-result'
import type { EvidenceSet } from '../retrieval/evidence-set'

export class DecisionEngineV1
  implements DecisionEngine
{
  decide(
    evidence: EvidenceSet,
    confidence: ConfidenceResult
  ): DecisionResult {

    const type =
      confidence.level === 'low'
        ? 'no_decision'
        : 'recommendation'

    const title =
      type === 'recommendation'
        ? 'Recommendation available'
        : 'Insufficient evidence'

    const summary =
      type === 'recommendation'
        ? `Decision generated with ${confidence.level} confidence.`
        : 'More evidence is required before making a recommendation.'

    return {
      id: `decision-${Date.now()}`,
      type,
      title,
      summary,
      confidence,
      evidence,
      createdAt: new Date().toISOString(),
    }
  }
}
