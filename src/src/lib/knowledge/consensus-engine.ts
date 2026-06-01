export type ConsensusInputAnswer = {
  question_code: string
  question_type: string
  answer_text: string
  answer_json: Record<string, any> | null
  confidence: number | null
}

export type ConsensusResult = {
  question_code: string
  question_type: string
  winning_answer: string
  votes: number
  total_votes: number
  confidence_score: number
}

export function calculateConsensus(
  answers: ConsensusInputAnswer[]
): ConsensusResult[] {
  const grouped = new Map<string, ConsensusInputAnswer[]>()

  answers.forEach((answer) => {
    const key = `${answer.question_code}::${answer.question_type}`
    const current = grouped.get(key) ?? []
    current.push(answer)
    grouped.set(key, current)
  })

  return Array.from(grouped.entries()).map(([key, group]) => {
    const [question_code, question_type] = key.split('::')

    const votesByAnswer = new Map<string, number>()

    group.forEach((answer) => {
      const current = votesByAnswer.get(answer.answer_text) ?? 0
      votesByAnswer.set(answer.answer_text, current + 1)
    })

    const sorted = Array.from(votesByAnswer.entries()).sort(
      (a, b) => b[1] - a[1]
    )

    const [winning_answer, votes] = sorted[0]

    const total_votes = group.length
    const averageConfidence =
      group.reduce((sum, answer) => sum + (answer.confidence ?? 1), 0) /
      total_votes

    return {
      question_code,
      question_type,
      winning_answer,
      votes,
      total_votes,
      confidence_score: Number(
        ((votes / total_votes) * averageConfidence).toFixed(3)
      ),
    }
  })
}
