import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'

type AdminAccessState =
  | 'checking'
  | 'allowed'
  | 'signed_out'
  | 'missing_profile'
  | 'denied'
  | 'error'

type AdminAccessGateProps = {
  children: ReactNode
}

export function AdminAccessGate({ children }: AdminAccessGateProps) {
  const [state, setState] = useState<AdminAccessState>('checking')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function checkAdminAccess() {
      setState('checking')
      setMessage('')

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()

      if (cancelled) return

      if (sessionError) {
        setState('error')
        setMessage(sessionError.message)
        return
      }

      const user = sessionData.session?.user

      if (!user) {
        setState('signed_out')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('expert_profiles')
        .select('id, is_admin')
        .eq('user_id', user.id)
        .maybeSingle()

      if (cancelled) return

      if (profileError) {
        setState('error')
        setMessage(profileError.message)
        return
      }

      if (!profile) {
        setState('missing_profile')
        return
      }

      setState(profile.is_admin === true ? 'allowed' : 'denied')
    }

    checkAdminAccess()

    return () => {
      cancelled = true
    }
  }, [])

  if (state === 'checking') {
    return (
      <AdminAccessShell>
        <p className="text-sm uppercase tracking-widest text-amber-400">
          A verificar acesso
        </p>
        <h1 className="text-3xl font-light">A carregar área admin…</h1>
        <p className="text-zinc-400">
          Estamos a confirmar se este utilizador tem permissões de administração.
        </p>
      </AdminAccessShell>
    )
  }

  if (state === 'allowed') {
    return <>{children}</>
  }

  return (
    <AdminAccessShell>
      <p className="text-sm uppercase tracking-widest text-red-400">
        Acesso reservado
      </p>
      <h1 className="text-3xl font-light">Área exclusiva para administradores SomAS</h1>
      <p className="max-w-2xl text-zinc-400 leading-relaxed">
        Esta zona contém dados de governação, qualidade, sessões, exportações,
        consenso, embeddings e ferramentas técnicas. Sommeliers, chefs,
        enólogos, produtores ou outros especialistas só devem aceder aqui se
        tiverem permissões administrativas atribuídas no Supabase.
      </p>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 text-sm text-zinc-300">
        {getAccessMessage(state, message)}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/knowledge"
          className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
        >
          Ir para área de contributo
        </Link>
        <Link
          to="/"
          className="rounded-full border border-zinc-700 px-5 py-3 text-sm text-zinc-200 hover:border-zinc-500"
        >
          Voltar ao início
        </Link>
      </div>
    </AdminAccessShell>
  )
}

function AdminAccessShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 p-8">
      <section className="mx-auto flex min-h-[70vh] max-w-4xl flex-col justify-center gap-6">
        {children}
      </section>
    </main>
  )
}

function getAccessMessage(state: AdminAccessState, message: string) {
  if (state === 'signed_out') {
    return 'Não há uma sessão ativa. Inicia sessão antes de aceder ao admin.'
  }

  if (state === 'missing_profile') {
    return 'A tua conta ainda não tem perfil de especialista associado. Cria o perfil em /knowledge e pede a um administrador para atribuir acesso, se necessário.'
  }

  if (state === 'denied') {
    return 'A conta está ativa, mas não está marcada como admin. Por defeito, novos utilizadores não têm acesso ao admin.'
  }

  if (state === 'error') {
    return message || 'Não foi possível confirmar permissões de administração.'
  }

  return ''
}
