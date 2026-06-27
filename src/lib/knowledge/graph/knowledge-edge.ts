import type { KnowledgeNodeType } from './knowledge-types'

export interface KnowledgeNode {

    id: string

    type: KnowledgeNodeType

    name: string

    metadata: Record<string, unknown>
}
