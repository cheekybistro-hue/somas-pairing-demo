import type {
  RetrievalEvidence
} from './retrieval-result'

import type {
  RetrievalRequest
} from './retrieval-types'

export interface SemanticRetrieval {

  retrieve(
    request: RetrievalRequest
  ): Promise<RetrievalEvidence[]>
}
