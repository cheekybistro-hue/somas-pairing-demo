import type {
  EvidenceEngine,
} from './evidence-engine'

import {
  buildEvidenceSet,
} from './evidence-set'

import type {
  RetrievalRequest,
} from './retrieval-types'

import type {
  RetrievalEvidence,
} from './retrieval-result'

import type {
  SemanticRetrieval,
} from './semantic-retrieval'

export class EvidenceEngineV1 implements EvidenceEngine {
  constructor(
    private readonly semanticRetrieval: SemanticRetrieval
  ) {}

  async buildEvidenceSet(
    request: RetrievalRequest
  ) {
    const semanticEvidence =
      await this.semanticRetrieval.retrieve(request)

    const evidence: RetrievalEvidence[] =
      semanticEvidence.map((item) => ({
        ...item,
        type: item.type ?? 'semantic_chunk',
        source: item.source ?? 'semantic_retrieval',
        retrievedAt:
          item.retrievedAt ??
          new Date().toISOString(),
      }))

    return buildEvidenceSet(
      request.query,
      evidence
    )
  }
}
