import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { runConsensusJob } from '../lib/knowledge/consensus-job'
import { loadConsensusSnapshot } from '../lib/knowledge/consensus-persistence'

export const Route = createFileRoute('/dev/consensus')({
  component: ConsensusDevPage,
})

function ConsensusDevPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [consensus, setConsensus] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  async function handleRunConsensus() {
    try {
      setLoading(true)
      setError(null)

      const jobResult = await runConsensusJob()

      setResult(jobResult)

      const snapshot = await loadConsensusSnapshot()

      setConsensus(snapshot)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-light">
          Consensus Development Page
        </h1>

        <button
          onClick={handleRunConsensus}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Running...' : 'Run Consensus Job'}
        </button>

        {error && (
          <div className="p-4 rounded border border-red-800 bg-red-950/40 text-red-300">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
            <h2 className="text-xl mb-4">
              Job Result
            </h2>

            <div>
              Answers Processed:{' '}
              <strong>{result.answersProcessed}</strong>
            </div>

            <div>
              Consensus Generated:{' '}
              <strong>{result.consensusGenerated}</strong>
            </div>
          </div>
        )}

        {consensus.length > 0 && (
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
            <h2 className="text-xl mb-4">
              Consensus Snapshot
            </h2>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left p-2">
                      Question
                    </th>
                    <th className="text-left p-2">
                      Type
                    </th>
                    <th className="text-left p-2">
                      Winning Answer
                    </th>
                    <th className="text-left p-2">
                      Votes
                    </th>
                    <th className="text-left p-2">
                      Total
                    </th>
                    <th className="text-left p-2">
                      Confidence
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {consensus.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-zinc-800"
                    >
                      <td className="p-2">
                        {item.question_code}
                      </td>

                      <td className="p-2">
                        {item.question_type}
                      </td>

                      <td className="p-2">
                        {item.winning_answer}
                      </td>

                      <td className="p-2">
                        {item.votes}
                      </td>

                      <td className="p-2">
                        {item.total_votes}
                      </td>

                      <td className="p-2">
                        {Number(
                          item.confidence_score ?? 0
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
