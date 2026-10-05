import { ArrowRight, Brain } from 'lucide-react'
import DescriptorSelector from './DescriptorSelector'
import { WineAromaticQuestionCard } from './WineAromaticQuestionCard'
import { AROMATIC_FAMILIES } from '../../lib/knowledge/aromatic-taxonomy'
import { DishQuestionCard } from './DishQuestionCard'
import { getFoodArchetype, getWineProfile } from '../../lib/knowledge/pairing-taxonomy'

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

  cookingMethod: string
  setCookingMethod: (value: string) => void

  dishSensoryValues: Record<string, number>
  setDishSensoryValues: (values: Record<string, number>) => void

  isQualitativeRelationshipType: (questionType: string) => boolean
  isInternationalIdentityType: (questionType: string) => boolean
}

function getQuestionPurpose(questionType: string) {
  if (questionType === 'pairing_choice') {
    return {
      label: 'O que está a decidir?',
      text:
        'Está a escolher o perfil de vinho que melhor funciona para este arquétipo gastronómico. A lógica deve partir da estrutura sensorial do prato-tipo, não de uma marca ou prato específico.',
      how:
        'Observe acidez, gordura, salinidade, textura, intensidade e confeção. Depois escolha o Wxx que equilibra, corta, acompanha ou valoriza essa estrutura.',
    }
  }

  if (questionType === 'national_region') {
    return {
      label: 'O que está a mapear?',
      text:
        'Está a associar este perfil vínico a uma região portuguesa representativa. A resposta deve ajudar alguém a perceber onde este estilo existe ou é mais reconhecível em Portugal.',
      how:
        'Escolha uma região, sub-região ou território que traduza bem o perfil Wxx. Não precisa de indicar produtor nem rótulo.',
    }
  }

  if (questionType === 'international_identity') {
    return {
      label: 'O que está a criar?',
      text:
        'Está a criar uma ponte internacional para este perfil Wxx, usando regiões, castas ou estilos que sejam reconhecíveis fora do contexto português.',
      how:
        'Escolha uma referência internacional clara e, se fizer sentido, indique castas e um vinho de referência. O objetivo é explicar o perfil por analogia.',
    }
  }

  if (['qualitative_relationship', 'similar_profile', 'relationship_profile'].includes(questionType)) {
    return {
      label: 'O que está a relacionar?',
      text:
        'Está a indicar que outro perfil Wxx é sensorialmente próximo deste. Isto ajuda o SomAS a sugerir alternativas, fallback e navegação entre estilos.',
      how:
        'Escolha o perfil mais semelhante e indique se a relação é muito semelhante, semelhante ou apenas parcial.',
    }
  }

  if (questionType === 'wine_aromatic_profile') {
    return {
      label: 'O que está a medir?',
      text:
        'Está a avaliar que famílias aromáticas são relevantes para este perfil Wxx. A resposta deve representar o estilo, não uma garrafa específica.',
      how:
        'Use a escala 0–5 para marcar presença aromática: ausente, subtil, secundária, clara, marcante ou dominante.',
    }
  }

  if (questionType === 'dish_intelligence') {
    return {
      label: 'O que está a descrever?',
      text:
        'Está a ligar um prato real ao arquétipo apresentado, indicando confeção e perfil sensorial. Isto ajuda o SomAS a sair da teoria para pratos concretos.',
      how:
        'Indique um prato representativo, escolha a confeção principal e avalie as dimensões sensoriais do prato enquanto objeto de harmonização.',
    }
  }

  return {
    label: 'Como responder?',
    text: 'Responda de forma prática, com base na sua experiência profissional.',
    how: 'Use a resposta principal, os atributos e o comentário para deixar clara a lógica da sua escolha.',
  }
}

function QuestionContextCard({ currentQuestion }: { currentQuestion: any }) {
  const foodArchetype = currentQuestion.food_archetype_code
    ? getFoodArchetype(currentQuestion.food_archetype_code)
    : undefined
  const wineProfile = currentQuestion.wine_profile_code
    ? getWineProfile(currentQuestion.wine_profile_code)
    : undefined
  const guidance = getQuestionPurpose(currentQuestion.question_type)

  const subjectCode = foodArchetype?.code ?? wineProfile?.code
  const subjectTitle = foodArchetype?.title ?? wineProfile?.title
  const subjectDescription = foodArchetype?.description ?? wineProfile?.description
  const sensoryContext = foodArchetype?.sensoryContext
  const aromaticHints = wineProfile?.aromaticHints

  if (!subjectCode && !subjectTitle) {
    return null
  }

  return (
    <section className="mb-6 rounded-2xl border border-amber-500/25 bg-amber-950/10 p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-400 mb-2">
            Contexto da pergunta
          </p>
          <h3 className="text-lg font-semibold text-zinc-100">
            {subjectCode} — {subjectTitle}
          </h3>
        </div>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          {guidance.label}
        </span>
      </div>

      {subjectDescription && (
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          {subjectDescription}
        </p>
      )}

      {sensoryContext && (
        <div className="mt-4 rounded-xl border border-zinc-700/70 bg-zinc-950/30 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
            Leitura sensorial
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {sensoryContext}
          </p>
        </div>
      )}

      {aromaticHints && aromaticHints.length > 0 && (
        <div className="mt-4 rounded-xl border border-zinc-700/70 bg-zinc-950/30 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
            Pistas aromáticas típicas
          </p>
          <div className="flex flex-wrap gap-2">
            {aromaticHints.map((hint) => (
              <span key={hint} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                {hint}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="rounded-xl border border-zinc-700/70 bg-zinc-950/30 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
            Propósito
          </p>
          <p className="text-zinc-300 leading-relaxed">{guidance.text}</p>
        </div>
        <div className="rounded-xl border border-zinc-700/70 bg-zinc-950/30 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
            Como preencher esta pergunta
          </p>
          <p className="text-zinc-300 leading-relaxed">{guidance.how}</p>
        </div>
      </div>
    </section>
  )
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

      <QuestionContextCard currentQuestion={currentQuestion} />

      {currentQuestion.question_type === 'dish_intelligence' ? (
        <DishQuestionCard
          foodArchetypeCode={currentQuestion.food_archetype_code}
          dishName={dishName}
          setDishName={setDishName}
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
