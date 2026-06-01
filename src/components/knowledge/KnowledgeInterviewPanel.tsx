import { ArrowRight, Brain, CheckCircle } from 'lucide-react'
import DescriptorSelector from './DescriptorSelector'

type Props = {
  selectedModule: any
  currentQuestion: any
  questionIndex: number
  questions: any[]

  selectedWine: string
  setSelectedWine: (v: string) => void

  selectedValue: string
  setSelectedValue: (v: string) => void

  similarityDegree: string
  setSimilarityDegree: (v: string) => void

  secondaryRegionStyles: string[]
  setSecondaryRegionStyles: (v: string[]) => void

  primaryGrape: string
  setPrimaryGrape: (v: string) => void

  secondaryGrapes: string[]
  setSecondaryGrapes: (v: string[]) => void

  referenceProducer: string
  setReferenceProducer: (v: string) => void

  referenceLabel: string
  setReferenceLabel: (v: string) => void

  referenceYear: string
  setReferenceYear: (v: string) => void

  selectedDescriptors: string[]
  setSelectedDescriptors: any

  reason: string
  setReason: (v: string) => void

  confidence: number
  setConfidence: (v: number) => void

  answeredInModule: number
  loading: boolean
  error: string | null

  saveAnswer: () => void
  backToModules: () => void

  QuestionInput: any
  Field: any
  ErrorBox: any

  isQualitativeRelationshipType: any
  isInternationalIdentityType: any
}

export default function KnowledgeInterviewPanel(props: Props) {
  const {
    selectedModule,
    currentQuestion,
    questionIndex,
    questions,

    selectedWine,
    setSelectedWine,

    selectedValue,
    setSelectedValue,

    similarityDegree,
    setSimilarityDegree,

    secondaryRegionStyles,
    setSecondaryRegionStyles,

    primaryGrape,
    setPrimaryGrape,

    secondaryGrapes,
    setSecondaryGrapes,

    referenceProducer,
    setReferenceProducer,

    referenceLabel,
    setReferenceLabel,

    referenceYear,
    setReferenceYear,

    selectedDescriptors,
    setSelectedDescriptors,

    reason,
    setReason,

    confidence,
    setConfidence,

    answeredInModule,
    loading,
    error,

    saveAnswer,
    backToModules,

    QuestionInput,
    Field,
    ErrorBox,

    isQualitativeRelationshipType,
    isInternationalIdentityType,
  } = props

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
      {/* conteúdo vem daqui */}
    </div>
  )
}
