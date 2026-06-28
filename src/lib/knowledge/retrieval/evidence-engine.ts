import type {
  EvidenceSet,
} from './evidence-set'

import type {
  RetrievalRequest,
} from './retrieval-types'

export interface EvidenceEngine {
  buildEvidenceSet(
    request: RetrievalRequest
  ): Promise<EvidenceSet>
}
