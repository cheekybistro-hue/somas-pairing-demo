import { ArrowRight, Brain } from 'lucide-react'
import DescriptorSelector from './DescriptorSelector'
import { WineAromaticQuestionCard } from './WineAromaticQuestionCard'
import { AROMATIC_FAMILIES } from '../../lib/knowledge/aromatic-taxonomy'
import { DishQuestionCard } from './DishQuestionCard'
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
  setSecondaryRegionStyles: any

  primaryGrape: string
  setPrimaryGrape: (v: string) => void

  secondaryGrapes: string[]
  setSecondaryGrapes: any

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

aromaticValues: Record<string, number>
setAromaticValues: any

  
  answeredInModule: number
  loading: boolean
  error: string | null

  saveAnswer: () => void
  backToModules: () => void

  QuestionInput: any
  Field: any
  ErrorBox: any

dishName: string
setDishName: (value: string) => void

archetypeCode: string
setArchetypeCode: (value: string) => void

cookingMethod: string
setCookingMethod: (value: string) => void

dishSensoryValues: Record<string, number>
setDishSensoryValues: (values: Record<string, number>) => void
  
  isQualitativeRelationshipType: (questionType: string) => boolean
  isInternationalIdentityType: (questionType: string) => boolean
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
    
    aromaticValues,
    setAromaticValues,
    
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

    dishName,
   setDishName,
   archetypeCode,
   setArchetypeCode,
   cookingMethod,
   setCookingMethod,
   dishSensoryValues,
   setDishSensoryValues,
     } = props

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
      <button
        type="button"
        onClick={backToModules}
        className="text-sm text-zinc-400 hover:text-amber-400 mb-6"
      >
        ← Voltar aos módulos
      </button>

      <div className="mb-6 text-sm text-zinc-400">
        <div>{selectedModule.module_name}</div>
        <div>
          Pergunta {questionIndex + 1} de {questions.length}
        </div>
      </div>

{currentQuestion.question_type !== 'wine_aromatic_profile' && (
  <div className="text-amber-400 font-mono mb-2">
    {currentQuestion.food_archetype_code || currentQuestion.wine_profile_code}
  </div>
)}

{currentQuestion.question_type === 'dish_intelligence' ? (
  <DishQuestionCard
    dishName={dishName}
    setDishName={setDishName}
    archetypeCode={archetypeCode}
    setArchetypeCode={setArchetypeCode}
    cookingMethod={cookingMethod}
    setCookingMethod={setCookingMethod}
    sensoryValues={dishSensoryValues}
    setSensoryValues={setDishSensoryValues}
  />
) : currentQuestion.question_type === 'wine_aromatic_profile' ? (
  <WineAromaticQuestionCard
    question={{
      wine_profile_code: currentQuestion.wine_profile_code,
      wine_profile_title: currentQuestion.helper_text,
      question_text: currentQuestion.question_text,
      aromatic_families: AROMATIC_FAMILIES,
    } as any}
    values={aromaticValues ?? {}}
    onChange={(code, value) => {
      setAromaticValues({
        ...(aromaticValues ?? {}),
        [code]: value,
      })
    }}
  />
) : (
  <>
    <QuestionInput
      question={currentQuestion}
      selectedWine={selectedWine}
      setSelectedWine={setSelectedWine}
      selectedValue={selectedValue}
      setSelectedValue={setSelectedValue}
      similarityDegree={similarityDegree}
      setSimilarityDegree={setSimilarityDegree}
      secondaryRegionStyles={secondaryRegionStyles}
      setSecondaryRegionStyles={setSecondaryRegionStyles}
      primaryGrape={primaryGrape}
      setPrimaryGrape={setPrimaryGrape}
      secondaryGrapes={secondaryGrapes}
      setSecondaryGrapes={setSecondaryGrapes}
      referenceProducer={referenceProducer}
      setReferenceProducer={setReferenceProducer}
      referenceLabel={referenceLabel}
      setReferenceLabel={setReferenceLabel}
      referenceYear={referenceYear}
      setReferenceYear={setReferenceYear}
    />

    <DescriptorSelector
      label={
        isQualitativeRelationshipType(currentQuestion.question_type) ||
        isInternationalIdentityType(currentQuestion.question_type)
          ? 'Estilo de Vinho'
          : 'Que atributos justificam esta escolha?'
      }
      selectedDescriptors={selectedDescriptors}
      setSelectedDescriptors={setSelectedDescriptors}
    />
  </>
)}

      <div className="mt-6">
        <Field label="Comentário opcional" icon={<Brain className="w-4 h-4" />}>
          <textarea
            key={currentQuestion.question_code}
            value={reason}
            onChange={(e: any) => setReason(e.target.value)}
            className="input min-h-[100px]"
            placeholder="Ex: explique em palavras suas, se quiser..."
          />
        </Field>
      </div>

      <div className="mt-6">
        <label className="block text-sm text-zinc-300 mb-2">
          Confiança: {confidence}
        </label>
        <input
          type="range"
          min="0.25"
          max="1"
          step="0.25"
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {error && <ErrorBox message={error} />}

      <div className="mt-8 flex justify-between items-center">
        <span className="text-zinc-500 text-sm">
          {answeredInModule} resposta(s) neste módulo
        </span>

        <button onClick={saveAnswer} disabled={loading} className="btn-primary">
          {loading ? 'A guardar…' : 'Guardar e continuar'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
