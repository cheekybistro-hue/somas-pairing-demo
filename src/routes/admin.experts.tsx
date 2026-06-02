import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/admin/experts')({
  component: AdminExpertsPage,
})

function AdminExpertsPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadExperts()
  }, [])

  async function loadExperts() {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('expert_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setProfiles(data ?? [])
    } catch (err: any) {
      setError(err.message ?? 'Erro ao carregar especialistas')
    } finally {
      setLoading(false)
    }
  }

  const uniqueExperts = useMemo(() => {
    const map = new Map()

    profiles.forEach((profile) => {
      const key =
        profile.email ??
        profile.display_name ??
        profile.id

      const existing = map.get(key)

      if (!existing) {
        map.set(key, profile)
        return
      }

      const existingDate = new Date(
        existing.created_at ?? 0
      ).getTime()

      const currentDate = new Date(
        profile.created_at ?? 0
      ).getTime()

      if (currentDate > existingDate) {
        map.set(key, profile)
      }
    })

    return Array.from(map.values())
  }, [profiles])

  const roleStats = useMemo(() => {
    const stats: Record<string, number> = {}

    uniqueExperts.forEach((expert) => {
      const role =
        expert.role?.trim() || 'Outros'

      stats[role] = (stats[role] ?? 0) + 1
    })

    return stats
  }, [uniqueExperts])

  const stats = useMemo(() => {
    return {
      totalExperts: uniqueExperts.length,
      activeExperts: uniqueExperts.filter(
        (p) => p.is_active !== false
      ).length,
    }
  }, [uniqueExperts])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <header>
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-2">
            SomAS Admin
          </p>

          <h1 className="text-4xl font-light">
            Expert Insights
          </h1>

          <p className="text-zinc-400 mt-3">
            Rede de especialistas que contribuem para a construção do conhecimento SomAS.
          </p>
        </header>

        {error && (
          <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-300">
            {error}
          </div>
        )}

        <section className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <StatCard
            label="Especialistas"
            value={stats.totalExperts}
            helper="Perfis únicos"
          />

          <StatCard
            label="Ativos"
            value={stats.activeExperts}
            helper="Perfis ativos"
          />

          {Object.entries(roleStats).map(
            ([role, count]) => (
              <StatCard
                key={role}
                label={role}
                value={count}
                helper="Especialistas"
              />
            )
          )}
        </section>

        <section className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light">
                Expert Directory
              </h2>

              <p className="text-zinc-500 text-sm mt-1">
                {uniqueExperts.length} especialistas únicos
              </p>
            </div>

            <button
              type="button"
              onClick={loadExperts}
              className="px-4 py-2 rounded-xl border border-amber-400 text-amber-400 hover:bg-amber-400/10 text-sm"
            >
              Atualizar
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-zinc-400">
              A carregar especialistas...
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-zinc-400">
                    <th className="text-left p-3">
                      Nome
                    </th>

                    <th className="text-left p-3">
                      Função
                    </th>

                    <th className="text-left p-3">
                      País
                    </th>

                    <th className="text-left p-3">
                      Organização
                    </th>

                    <th className="text-left p-3">
                      Experiência
                    </th>

                    <th className="text-left p-3">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {uniqueExperts.map((profile) => (
                    <tr
                      key={profile.id}
                      className="border-b border-zinc-800 hover:bg-zinc-900/50"
                    >
                      <td className="p-3 font-semibold">
                        {profile.display_name ??
                          'Sem nome'}
                      </td>

                      <td className="p-3">
                        {profile.role ?? '-'}
                      </td>

                      <td className="p-3">
                        {profile.country ?? '-'}
                      </td>

                      <td className="p-3">
                        {profile.organization ?? '-'}
                      </td>

                      <td className="p-3">
                        {profile.years_experience
                          ? `${profile.years_experience} anos`
                          : '-'}
                      </td>

                      <td className="p-3">
                        {profile.is_active === false
                          ? 'Inativo'
                          : 'Ativo'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {uniqueExperts.length === 0 && (
                <div className="py-12 text-center text-zinc-500">
                  Nenhum especialista encontrado.
                </div>
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  helper,
}: {
  label: string
  value: string | number
  helper: string
}) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5">
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
        {label}
      </div>

      <div className="text-2xl font-semibold">
        {value}
      </div>

      <div className="text-sm text-zinc-500 mt-1">
        {helper}
      </div>
    </div>
  )
}
