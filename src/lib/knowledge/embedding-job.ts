import { loadConsensusSnapshot } from './consensus-persistence'
import {
  buildConsensusEmbeddingRequests,
  createPendingEmbeddings,
} from './embedding-service'
import { savePendingEmbeddings } from './embedding-persistence'

export async function runEmbeddingPreparationJob() {
  const consensus = await loadConsensusSnapshot()

  const requests =
    buildConsensusEmbeddingRequests(consensus)

  const pendingEmbeddings =
    createPendingEmbeddings(requests)

  await savePendingEmbeddings(pendingEmbeddings)

  return {
    consensusItems: consensus.length,
    embeddingRequests: requests.length,
    pendingEmbeddings: pendingEmbeddings.length,
  }
}
