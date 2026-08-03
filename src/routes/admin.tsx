import {
  Outlet,
  createFileRoute,
  Link,
  useRouterState,
} from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminControlCenterPage,
})

type QuickLink = {
  area: string
  title: string
  description: string
  href: string
}

type AdminAreaCard = {
  title: string
  description: string
  href: string
  label: string
  stage: string
  useWhen: string
  output: string
  status?: string
}

type AdminSection = {
  title: string
  description: string
  cards: AdminAreaCard[]
}

const quickLinks: QuickLink[] = [
  {
    area: 'Knowledge',
    title: 'Consensus',
    description: 'Base consolidada',
    href: '/admin/knowledge',
  },
  {
    area: 'Quality',
    title: 'Review',
    description: 'Contributos reais',
    href: '/admin/quality',
  },
  {
    area: 'Targets',
    title: 'Plan',
    description: 'Recolha guiada',
    href: '/admin/targets',
  },
  {
    area: 'Sessions',
    title: 'PR16',
    description: 'Quem chamar',
    href: '/admin/sessions',
  },
  {
    area: 'Experts',
    title: 'Network',
    description: 'Especialistas ativos',
    href: '/admin/experts',
  },
  {
    area: 'AI',
    title: 'RAG',
    description: 'Pesquisa e assistente',
    href: '/dev/rag',
  },
]

const adminSections: AdminSection[] = [
  {
    title: '1. Operação de recolha',
    description:
      'Planeia o que ainda falta recolher e transforma lacunas em sessões práticas com especialistas.',
    cards: [
      {
        title: 'Contribution Targets',
        description:
          'Mostra que perguntas, arquétipos e perfis ainda precisam de respostas úteis para atingir cobertura mínima.',
        href: '/admin/targets',
        label: 'Ver plano de recolha',
        stage: 'O que falta?',
        useWhen:
          'Antes de convidar especialistas, para decidir que módulos e perguntas devem ser priorizados.',
        output:
          'Alvos críticos, alta prioridade, respostas em falta e cobertura por módulo.',
        status: 'PR15.1',
      },
      {
        title: 'Collection Sessions',
        description:
          'Agrupa alvos por tipo de especialista: chefs, sommeliers, enólogos, produtores, CVR ou equipa SomAS.',
        href: '/admin/sessions',
        label: 'Preparar sessões',
        stage: 'Quem chamar?',
        useWhen:
          'Para preparar uma sessão real de recolha com objetivos claros e perguntas sugeridas.',
        output:
          'Sessões recomendadas, participantes, duração, módulos, alvos e resultado esperado.',
        status: 'PR16',
      },
    ],
  },
  {
    title: '2. Validação e qualidade',
    description:
      'Acompanha o que entrou, separa contributos reais de testes e identifica respostas que precisam de revisão.',
    cards: [
      {
        title: 'Knowledge Quality',
        description:
          'Mostra todas as respostas introduzidas por sommeliers, chefs e especialistas, com sinais automáticos de qualidade.',
        href: '/admin/quality',
        label: 'Rever contributos',
        stage: 'O que entrou?',
        useWhen:
          'Depois de uma sessão de recolha, para verificar dados recebidos, sinais de teste e respostas candidatas.',
        output:
          'Contributos prontos, candidatos, sinais de teste, respostas a rever e distribuição por módulo.',
        status: 'PR14.1',
      },
      {
        title: 'Knowledge Gaps',
        description:
          'Áreas com baixa confiança, pouca cobertura, divergência ou ausência de consenso.',
        href: '/admin/gaps',
        label: 'Ver gaps',
        stage: 'Onde há fragilidade?',
        useWhen:
          'Para perceber onde o conhecimento ainda está fraco antes de exportar ou usar em RAG.',
        output: 'Gaps de cobertura, confiança e consistência.',
      },
      {
        title: 'Expert Insights',
        description:
          'Rede de especialistas, perfis, funções, organizações e contribuição por pessoa.',
        href: '/admin/experts',
        label: 'Ver especialistas',
        stage: 'Quem contribuiu?',
        useWhen:
          'Para acompanhar a rede de especialistas e perceber que perfis estão representados.',
        output: 'Lista e visão operacional dos especialistas.',
      },
    ],
  },
  {
    title: '3. Consenso, dataset e exportação',
    description:
      'Transforma contributos individuais em conhecimento estruturado, datasets e documentos para RAG.',
    cards: [
      {
        title: 'Knowledge Dashboard',
        description:
          'Mostra consensos, exportações e prontidão do dataset para integração noutros sistemas.',
        href: '/admin/knowledge',
        label: 'Abrir conhecimento',
        stage: 'O que já podemos usar?',
        useWhen:
          'Quando houver massa crítica e for preciso exportar dados para dataset, embeddings ou RAG.',
        output:
          'Consensus dataset, raw answers, embeddings JSONL e bundle completo SomAS.',
        status: 'PR13.1',
      },
      {
        title: 'Knowledge Operations',
        description:
          'Operações para gerar Knowledge Passports e preparar conhecimento para o SomAS Core Decision Engine.',
        href: '/admin/operations',
        label: 'Abrir operações',
        stage: 'Como alimentar o motor?',
        useWhen:
          'Para operações de preparação e passagem de conhecimento para a camada core do SomAS.',
        output: 'Knowledge passports e operações de preparação.',
      },
    ],
  },
  {
    title: '4. Laboratório técnico e IA',
    description:
      'Ferramentas técnicas para testar consenso, embeddings, documentos RAG, pesquisa semântica e assistente.',
    cards: [
      {
        title: 'Consensus Lab',
        description:
          'Executar, testar e validar a geração de consenso a partir das respostas dos especialistas.',
        href: '/dev/consensus',
        label: 'Abrir consensus lab',
        stage: 'Como o consenso é calculado?',
        useWhen:
          'Em modo técnico, para validar regras de consenso e resultados calculados.',
        output: 'Snapshots e validação técnica de consenso.',
      },
      {
        title: 'Embedding Pipeline',
        description:
          'Preparar e gerar embeddings para pesquisa semântica sobre conhecimento SomAS.',
        href: '/dev/embeddings',
        label: 'Abrir embeddings',
        stage: 'Como indexar?',
        useWhen:
          'Quando o dataset estiver pronto para geração ou atualização de embeddings.',
        output: 'Pipeline e estado de embeddings.',
      },
      {
        title: 'RAG Documents',
        description:
          'Visualizar documentos semânticos usados para embeddings e respostas RAG.',
        href: '/dev/rag',
        label: 'Ver documentos RAG',
        stage: 'Que textos alimentam a IA?',
        useWhen: 'Para auditar os documentos antes de serem indexados.',
        output: 'Documentos de conhecimento legíveis para RAG.',
      },
      {
        title: 'Semantic Search',
        description:
          'Pesquisar conhecimento consolidado através de embeddings.',
        href: '/dev/search',
        label: 'Abrir pesquisa',
        stage: 'Como encontrar conhecimento?',
        useWhen:
          'Para testar recuperação semântica e qualidade dos embeddings.',
        output: 'Resultados de pesquisa semântica.',
      },
      {
        title: 'Knowledge Assistant',
        description:
          'Protótipo RAG para respostas baseadas no conhecimento SomAS.',
        href: '/dev/answer',
        label: 'Abrir assistente',
        stage: 'Como responder com conhecimento?',
        useWhen:
          'Para testar respostas explicáveis baseadas no dataset SomAS.',
        output: 'Respostas assistidas por RAG.',
      },
    ],
  },
]

const workflow = [
  {
    step: '01',
    title: 'Ver o que falta recolher',
    href: '/admin/targets',
    label: 'Contribution Targets',
    description:
      'Identifica alvos críticos, alta prioridade e respostas em falta por módulo.',
  },
  {
    step: '02',
    title: 'Preparar a sessão certa',
    href: '/admin/sessions',
    label: 'Collection Sessions',
    description:
      'Decide se deves chamar chefs, sommeliers, enólogos, produtores, CVR ou equipa SomAS.',
  },
  {
    step: '03',
    title: 'Validar o que entrou',
    href: '/admin/quality',
    label: 'Knowledge Quality',
    description:
      'Revê contributos, sinais de teste, candidatos e respostas prontas.',
  },
  {
    step: '04',
    title: 'Exportar conhecimento utilizável',
    href: '/admin/knowledge',
    label: 'Knowledge Dashboard',
    description:
      'Gera datasets, bundle completo, JSONL para embeddings e base para RAG.',
  },
]

function AdminControlCenterPage() {
  const isChildAdminRoute = useRouterState({
    select: (state) => state.location.pathname !== '/admin',
  })

  if (isChildAdminRoute) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-amber-400 mb-2">
                SomAS Admin · Control Center
              </p>

              <h1 className="text-4xl font-light">
                Centro de controlo do conhecimento
              </h1>
            </div>

            <div className="rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm text-amber-200">
              Área reservada a administradores
            </div>
          </div>

          <p className="text-zinc-400 max-w-4xl leading-relaxed">
            Este é o ponto central do SomAS Admin. Aqui estão organizadas as
            páginas que permitem recolher conhecimento, planear sessões com
            especialistas, validar qualidade, gerar consenso, exportar datasets
            e preparar RAG. Sommeliers, chefs, enólogos ou produtores só devem
            aceder a esta área se tiverem permissões de administração.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group rounded-2xl border border-zinc-700 bg-zinc-800/50 p-5 hover:border-amber-400/70 hover:bg-zinc-800 transition"
            >
              <div className="text-xs uppercase tracking-widest text-zinc-500 group-hover:text-amber-400">
                {item.area}
              </div>

              <div className="mt-3 text-xl font-semibold group-hover:text-amber-300">
                {item.title}
              </div>

              <div className="mt-2 text-sm text-zinc-500">
                {item.description}
              </div>
            </Link>
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {workflow.map((item) => (
            <Link
              key={item.step}
              to={item.href}
              className="group rounded-2xl border border-zinc-700 bg-zinc-800/50 p-5 hover:border-amber-400/70 hover:bg-zinc-800 transition"
            >
              <div className="text-xs uppercase tracking-widest text-amber-400">
                Passo {item.step}
              </div>

              <h2 className="mt-3 text-xl font-semibold group-hover:text-amber-300">
                {item.title}
              </h2>

              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-4 text-sm text-amber-400">
                {item.label} →
              </div>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-zinc-700 bg-zinc-800/40 p-6">
          <h2 className="text-2xl font-light mb-3">
            Ciclo de governação do conhecimento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
            <ProcessPill label="Recolher" helper="Targets e sessões" />
            <ProcessPill label="Validar" helper="Quality e gaps" />
            <ProcessPill label="Consolidar" helper="Consenso" />
            <ProcessPill label="Exportar" helper="Dataset e JSONL" />
            <ProcessPill label="Ativar" helper="Embeddings e RAG" />
          </div>
        </section>

        {adminSections.map((section) => (
          <section key={section.title} className="space-y-4">
            <div>
              <h2 className="text-2xl font-light">{section.title}</h2>
              <p className="text-zinc-400 mt-1 max-w-3xl">
                {section.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {section.cards.map((card) => (
                <Link
                  key={card.href}
                  to={card.href}
                  className="group rounded-2xl border border-zinc-700 bg-zinc-800/50 p-6 hover:border-amber-400/70 hover:bg-zinc-800 transition"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-amber-300">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    {card.status ? (
                      <span className="rounded-full border border-zinc-600 px-3 py-1 text-xs text-zinc-300">
                        {card.status}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <InfoBox label="Pergunta" value={card.stage} />
                    <InfoBox label="Usar quando" value={card.useWhen} />
                    <InfoBox label="Mostra" value={card.output} />
                  </div>

                  <div className="mt-5 text-sm text-amber-400">
                    {card.label} →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function ProcessPill({ label, helper }: { label: string; helper: string }) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/60 p-4">
      <div className="text-base font-semibold text-zinc-100">{label}</div>
      <div className="mt-1 text-xs text-zinc-500">{helper}</div>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-3">
      <div className="text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-xs text-zinc-300 leading-relaxed">{value}</div>
    </div>
  )
}
