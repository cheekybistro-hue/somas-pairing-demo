import { loadAnswersForConsensus } from './consensus-service'
import { buildKnowledgeConsensus } from './consensus-builder'
import { saveConsensusSnapshot } from './consensus-persistence'

export async function runConsensusJob() {
  const answers = await loadAnswersForConsensus()

  const consensus = buildKnowledgeConsensus(answers)

  await saveConsensusSnapshot(consensus)

  return {
    answersProcessed: answers.length,
    consensusGenerated: consensus.length,
  }
}
