import type { KnowledgeEdge } from './knowledge-edge'
import type { KnowledgeNode } from './knowledge-node'

export interface KnowledgeGraph {

    nodes: KnowledgeNode[]

    edges: KnowledgeEdge[]
}
