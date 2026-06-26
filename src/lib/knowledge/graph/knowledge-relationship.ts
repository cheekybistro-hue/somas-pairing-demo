import type { KnowledgeRelationship } from './knowledge-relationship'

export interface KnowledgeEdge {

    from: string

    to: string

    relationship: KnowledgeRelationship

    confidence: number

    source: string
}
