import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Wine, Search, Grape, MapPin, Palette, Award, Globe2, Brain } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

const foodArchetypes = [
  { code: 'A01', label: 'Cru / iodado / alta frescura' },
  { code: 'A02', label: 'Marisco delicado / peixe cozido' },
  { code: 'A03', label: 'Peixe ou marisco grelhado' },
  { code: 'A04', label: 'Peixe gordo / untuoso' },
  { code: 'A05', label: 'Fritura delicada' },
  { code: 'A06', label: 'Vegetal / ervas / verde' },
  { code: 'A07', label: 'Cogumelos / terra / umami' },
  { code: 'A08', label: 'Aves delicadas' },
  { code: 'A09', label: 'Aves estruturadas' },
  { code: 'A10', label: 'Carne vermelha delicada' },
  { code: 'A11', label: 'Carne vermelha estruturada' },
  { code: 'A12', label: 'Caça / intensidade animal' },
  { code: 'A13', label: 'Fumado / carvão / tostado' },
  { code: 'A14', label: 'Picante / especiado' },
  { code: 'A15', label: 'Doçura moderada' },
  { code: 'A16', label: 'Sobremesa fresca' },
  { code: 'A17', label: 'Sobremesa intensa / chocolate' },
  { code: 'A18', label: 'Queijo fresco / suave' },
  { code: 'A19', label: 'Queijo curado / intenso' },
  { code: 'A20', label: 'Fortificado / meditação' },
]

interface WineRecommendation {
  food_archetype_code: string
  wine_profile_code: string
  consensus_score: number
  votes: number
  profile_name: string | null
  regions: string | null
  grapes: string | null
  sensory_styles: string | null
  international_references: string | null
}

function Home() {
  const [selectedArchetype, setSelectedArchetype] = useState('')
  const [recommendations, setRecommendations] = useState<WineRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchRecommendations() {
    if (!selectedArchetype) return

    setLoading(true)
    setError(null)
    setRecommendations([])

    const { data, error: rpcError } = await supabase.rpc('get_pairing_recommendations', {
      p_archetype_code: selectedArchetype,
      p_limit: 5,
    })

    if (rpcError) {
      setError(rpcError.message)
    } else {
      setRecommendations(data ?? [])
    }

    setLoading(false)
  }

  const selectedLabel = foodArchetypes.find((a) => a.code === selectedArchetype)?.label

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wine className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-zinc-50">
              SomAS <span className="font-semibold text-amber-400">Pairing Engine</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-lg font-light tracking-wide">
            Motor de recomendação vínica baseado em conhecimento humano especializado
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <label className="block text-sm font-medium text-zinc-300 mb-3 uppercase tracking-widest">
              Arquétipo gastronómico
            </label>

            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedArchetype}
                onChange={(e) => setSelectedArchetype(e.target.value)}
                className="flex-1 bg-zinc-900/80 border border-zinc-600/50 text-zinc-100 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all cursor-pointer"
              >
                <option value="">Escolher arquétipo…</option>
                {foodArchetypes.map((arch) => (
                  <option key={arch.code} value={arch.code}>
                    {arch.code} — {arch.label}
                  </option>
                ))}
              </select>

              <button
                onClick={fetchRecommendations}
                disabled={!selectedArchetype || loading}
                className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
              >
                <Search className="w-5 h-5" />
                {loading ? 'A procurar…' : 'Recomendar'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-4 text-red-300 text-sm">
              {error}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-zinc-400 font-light">A consultar o knowledge graph…</p>
          </div>
        )}

        {!loading && recommendations.length > 0 && (
          <div>
            <h2 className="text-xl font-light text-zinc-300 mb-6 text-center">
              Recomendações para{' '}
              <span className="text-amber-400 font-medium">{selectedLabel}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {recommendations.map((wine, idx) => (
                <div
                  key={`${wine.wine_profile_code}-${idx}`}
                  className="bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/40 rounded-2xl p-6 hover:border-amber-400/30 transition-all duration-300 group shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-mono text-zinc-400 bg-zinc-900/70 px-2.5 py-1 rounded-lg">
                      {wine.wine_profile_code}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-400 font-semibold text-lg">
                        {Number(wine.consensus_score).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-zinc-100 mb-2 group-hover:text-amber-300 transition-colors leading-snug">
                    {wine.profile_name ?? `Perfil vínico ${wine.wine_profile_code}`}
                  </h3>

                  <p className="text-xs text-zinc-500 mb-5">
                    {wine.votes} voto(s) de consenso
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5 text-sm">
                      <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-400">{wine.regions ?? 'Região ainda não definida'}</span>
                    </div>

                    <div className="flex items-start gap-2.5 text-sm">
                      <Grape className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-400">{wine.grapes ?? 'Castas ainda não definidas'}</span>
                    </div>

                    <div className="flex items-start gap-2.5 text-sm">
                      <Palette className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-400">{wine.sensory_styles ?? 'Estilo sensorial ainda não definido'}</span>
                    </div>

                    <div className="flex items-start gap-2.5 text-sm">
                      <Globe2 className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-400">{wine.international_references ?? 'Sem referência internacional'}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-zinc-700/50">
                    <div className="flex items-start gap-2.5">
                      <Brain className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        Recomendado porque este perfil tem consenso para o arquétipo selecionado
                        e combina atributos de região, casta e estilo sensorial já mapeados no SomAS.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && recommendations.length === 0 && selectedArchetype && (
          <div className="text-center py-16">
            <Wine className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 font-light">
              Ainda não existem recomendações validadas para este arquétipo.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
