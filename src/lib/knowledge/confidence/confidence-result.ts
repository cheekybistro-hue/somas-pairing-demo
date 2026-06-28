import type { ConfidenceLevel } from './confidence-level'

export interface ConfidenceResult {
  score: number
  level: ConfidenceLevel
  reasons: string[]
}
