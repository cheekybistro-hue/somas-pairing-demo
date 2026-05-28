import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Wine, Search, Grape, MapPin, Palette, Award } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

const foodArchetypes = [
  { code: 'A01', label: 'Grilled Red Meat' },
  { code: 'A02', label: 'Roasted Poultry' },
  { code: 'A03', label: 'Braised Lamb' },
  { code: 'A04', label: 'Pan-Seared Fish' },
  { code: 'A05', label: 'Raw Seafood & Sushi' },
  { code: 'A06', label: 'Shellfish & Crustaceans' },
  { code: 'A07', label: 'Creamy Pasta' },
  { code: 'A08', label: 'Tomato-Based Dishes' },
  { code: 'A09', label: 'Spicy Asian Cuisine' },
  { code: 'A10', label: 'Rich Cheese Plates' },
  { code: 'A11', label: 'Charcuterie & Cured Meats' },
  { code: 'A12', label: 'Vegetable & Grain Bowls' },
  { code: 'A13', label: 'Mushroom-Based Dishes' },
  { code: 'A14', label: 'Smoked & BBQ' },
  { code: 'A15', label: 'Light Salads & Herbs' },
  { code: 'A16', label: 'Chocolate Desserts' },
  { code: 'A17', label: 'Fruit-Based Desserts' },
  { code: 'A18', label: 'Fried & Crispy Foods' },
  { code: 'A19', label: 'Indian & Middle Eastern' },
  { code: 'A20', label: 'Game & Wild Meats' },
]

interface WineRecommendation {
  wine_profile_code: string
  wine_profile_name: string
  pairing_score: number
  region: string
  grape: string
  wine_style: string
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wine className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-zinc-50">
              Wine <span className="font-semibold text-amber-400">Pairing</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-lg font-light tracking-wide">
            Discover the perfect wine for every dish
          </p>
        </div>

        {/* Selection Controls */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <label className="block text-sm font-medium text-zinc-300 mb-3 uppercase tracking-widest">
              Select Food Type
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedArchetype}
                onChange={(e) => setSelectedArchetype(e.target.value)}
                className="flex-1 bg-zinc-900/80 border border-zinc-600/50 text-zinc-100 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all appearance-none cursor-pointer"
              >
                <option value="">Choose a food archetype…</option>
                {foodArchetypes.map((arch) => (
                  <option key={arch.code} value={arch.code}>
                    {arch.code} — {arch.label}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchRecommendations}
                disabled={!selectedArchetype || loading}
                className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 disabled:shadow-none"
              >
                <Search className="w-5 h-5" />
                {loading ? 'Searching…' : 'Get Recommendations'}
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-4 text-red-300 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-zinc-400 font-light">Finding perfect pairings…</p>
          </div>
        )}

        {/* Results */}
        {!loading && recommendations.length > 0 && (
          <div>
            <h2 className="text-xl font-light text-zinc-300 mb-6 text-center">
              Pairings for{' '}
              <span className="text-amber-400 font-medium">{selectedLabel}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.map((wine, idx) => (
                <div
                  key={`${wine.wine_profile_code}-${idx}`}
                  className="bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/40 rounded-2xl p-6 hover:border-amber-400/30 transition-all duration-300 group shadow-lg hover:shadow-amber-500/5"
                >
                  {/* Score Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-900/60 px-2.5 py-1 rounded-lg">
                      {wine.wine_profile_code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-400 font-semibold text-lg">
                        {wine.pairing_score}
                      </span>
                    </div>
                  </div>

                  {/* Wine Name */}
                  <h3 className="text-lg font-medium text-zinc-100 mb-4 group-hover:text-amber-300 transition-colors leading-snug">
                    {wine.wine_profile_name}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 text-sm">
                      <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span className="text-zinc-400">{wine.region}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                      <Grape className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span className="text-zinc-400">{wine.grape}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                      <Palette className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span className="text-zinc-400">{wine.wine_style}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State After Search */}
        {!loading && !error && recommendations.length === 0 && selectedArchetype && (
          <div className="text-center py-16">
            <Wine className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 font-light">
              No recommendations found. Try a different food type.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
