import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminHubPage,
})

function AdminHubPage() {
  const cards = [
    {
      title: 'Knowledge Dashboard',
      description:
        'Consensos gerados a partir das respostas dos especialistas.',
      href: '/admin/knowledge',
      label: 'Abrir conhecimento',
    },
    {
      title: 'Knowledge Gaps',
      description:
        'Áreas com baixa confiança, pouca cobertura ou divergência.',
      href: '/admin/gaps',
      label: 'Ver gaps',
    },
    {
      title: 'Expert Insights',
      description:
        'Rede de especialistas, funções, experiência e organizações.',
      href: '/admin/experts',
      label: 'Ver especialistas',
    },
    {
      title: 'Consensus Lab',
      description:
        'Executar e validar a geração de consenso.',
      href: '/dev/consensus',
      label: 'Abrir consensus lab',
    },
    {
      title: 'Embedding Pipeline',
      description:
        'Preparar e gerar embeddings para pesquisa semântica.',
      href: '/dev/embeddings',
      label: 'Abrir embeddings',
    },
    {
      title: 'RAG Documents',
      description:
        'Visualizar documentos semânticos usados para embeddings.',
      href: '/dev/rag',
      label: 'Ver documentos RAG',
    },
    {
      title: 'Semantic Search',
      description:
        'Pesquisar conhecimento consolidado através de embeddings.',
      href: '/dev/search',
      label: 'Abrir pesquisa',
    },
    {
      title: 'Knowledge Assistant',
      description:
        'Protótipo RAG para respostas baseadas no conhecimento SomAS.',
      href: '/dev/answer',
      label: 'Abrir assistente',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-2">
            SomAS Admin
          </p>

          <h1 className="text-4xl font-light">
            Admin Hub
          </h1>

          <p className="text-zinc-400 mt-3 max-w-3xl">
            Centro de controlo da plataforma SomAS. Aqui pode acompanhar
            conhecimento, especialistas, consenso, gaps, embeddings e os
            primeiros protótipos RAG.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Knowledge"
            value="Consensus"
            helper="Base consolidada"
          />

          <StatCard
            label="Quality"
            value="Gaps"
            helper="Cobertura e confiança"
          />

          <StatCard
            label="Experts"
            value="Network"
            helper="Especialistas ativos"
          />

          <StatCard
            label="AI"
            value="RAG"
            helper="Pesquisa e assistente"
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {cards.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className="group bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 hover:border-amber-400/70 hover:bg-zinc-800 transition"
            >
              <h2 className="text-xl font-semibold text-zinc-100 group-hover:text-amber-300">
                {card.title}
              </h2>

              <p className="text-zinc-400 text-sm mt-3 min-h-[60px]">
                {card.description}
              </p>

              <div className="mt-5 text-sm text-amber-400">
                {card.label} →
              </div>
            </Link>
          ))}
        </section>

        <section className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-6">
          <h2 className="text-2xl font-light mb-3">
            Como ler esta área
          </h2>

          <p className="text-zinc-400 leading-relaxed">
            O SomAS Admin acompanha a transformação de respostas individuais
            em conhecimento coletivo. Primeiro recolhemos contributos dos
            especialistas, depois calculamos consensos, identificamos gaps,
            preparamos datasets, geramos embeddings e finalmente usamos RAG
            para criar respostas explicáveis.
          </p>
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
