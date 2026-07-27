import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { loadModulesAndProgress } from '@/lib/knowledge/knowledge-service'
import { ModuleReviewPage } from '@/components/knowledge/ModuleReviewPage'
import type { KnowledgeModule } from '@/lib/knowledge/knowledge-types'

export const Route = createFileRoute('/knowledge/review/$moduleCode')({
  component: KnowledgeModuleReviewRoute,
})

function KnowledgeModuleReviewRoute() {
  const { moduleCode } = Route.useParams()
  const navigate = useNavigate()

  const [expertId, setExpertId] = useState<string | null>(null)
  const [module, setModule] = useState<KnowledgeModule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadReviewContext() {
      try {
        setLoading(true)
        setError(null)

        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession()

        if (sessionError) {
          throw new Error(sessionError.message)
        }

        const user = sessionData.session?.user

        if (!user) {
          void navigate({ to: '/knowledge' })
          return
        }

        const { data: expert, error: expertError } = await supabase
          .from('expert_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (expertError) {
          throw new Error(expertError.message)
        }

        if (!expert) {
          void navigate({ to: '/knowledge' })
          return
        }

        const knowledgeData = await loadModulesAndProgress(expert.id)

        const targetModule = knowledgeData.modules.find(
          (item) => item.module_code === moduleCode
        )

        if (!targetModule) {
          setError('Módulo não encontrado.')
          return
        }

        setExpertId(expert.id)
        setModule(targetModule)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar revisão do módulo.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadReviewContext()
  }, [moduleCode, navigate])

  if (loading) {
    return (
      <ReviewShell>
        <p className="text-zinc-400">A carregar revisão do módulo…</p>
      </ReviewShell>
    )
  }

  if (error || !expertId || !module) {
    return (
      <ReviewShell>
        <div className="rounded-2xl border border-red-800/50 bg-red-950/30 p-6 text-red-300">
          {error ?? 'Não foi possível carregar este módulo.'}
        </div>
      </ReviewShell>
    )
  }

  return (
    <ReviewShell>
      <ModuleReviewPage
        expertId={expertId}
        formPhase={module.form_phase}
        moduleName={module.module_name}
        onBack={() => {
          void navigate({ to: '/knowledge' })
        }}
        onContinue={() => {
          void navigate({ to: '/knowledge' })
        }}
        onEdit={() => {
          void navigate({ to: '/knowledge' })
        }}
      />
    </ReviewShell>
  )
}

function ReviewShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        {children}
      </div>
    </main>
  )
}
