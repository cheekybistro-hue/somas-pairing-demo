import { createFileRoute } from '@tanstack/react-router'
import {
  Brain,
  Database,
  Network,
  ShieldCheck,
  Lightbulb,
  Repeat,
  Wine,
  ArrowRight,
} from 'lucide-react'

export const Route = createFileRoute('/somas-core')({
  component: SomASCorePage,
})

function SomASCorePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 text-amber-400 mb-6">
            <Brain className="w-8 h-8" />
            <span className="uppercase tracking-widest text-sm">
              SomAS Core
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-light leading-tight">
            A infraestrutura cognitiva para valorizar o vinho português.
          </h1>

          <p className="text-xl text-zinc-400 mt-6 leading-relaxed">
            O SomAS transforma conhecimento especializado, consenso, passaportes digitais e utilização real em decisões explicáveis para produtores, CVRs, restaurantes, importadores e mercados internacionais.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <CorePillar
            icon={<Database className="w-6 h-6" />}
            title="Memória"
            text="Preserva conhecimento sobre vinhos, castas, regiões, pratos, mercados e experiências."
          />

          <CorePillar
            icon={<Network className="w-6 h-6" />}
            title="Consenso"
            text="Cruza respostas de especialistas para identificar acordo, divergência e confiança."
          />

          <CorePillar
            icon={<Lightbulb className="w-6 h-6" />}
            title="Decisão"
            text="Transforma evidências em recomendações úteis, rastreáveis e explicáveis."
          />

          <CorePillar
            icon={<Repeat className="w-6 h-6" />}
            title="Aprendizagem"
            text="Cada passaporte, harmonização e feedback melhora continuamente o sistema."
          />
        </div>

        <section className="mt-16 bg-zinc-900/70 border border-zinc-700/60 rounded-3xl p-8 md:p-10">
          <h2 className="text-3xl font-light">
            O SomAS não é apenas uma app de harmonização.
          </h2>

          <p className="text-zinc-400 mt-4 text-lg leading-relaxed">
            É uma infraestrutura de inteligência para transformar conhecimento vínico português em decisões estratégicas: posicionamento, harmonização, internacionalização, diferenciação regional e valorização económica.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <UseCase text="Que perfis da região têm maior potencial internacional?" />
            <UseCase text="Que castas estão subvalorizadas e merecem melhor posicionamento?" />
            <UseCase text="Que harmonizações comunicam melhor a identidade regional?" />
            <UseCase text="Que mercados valorizam frescura, acidez, mineralidade, estrutura ou intensidade aromática?" />
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-zinc-900/70 border border-zinc-700/60 rounded-3xl p-8">
            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <Wine className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">
                Passaporte Digital Vínico
              </h2>
            </div>

            <p className="text-zinc-400 leading-relaxed">
              O passaporte digital não é apenas uma ficha do vinho. É uma entidade viva que pode reunir história, terroir, castas, vinificação, harmonizações, feedback, mercados, experiências e evolução ao longo do tempo.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-700/60 rounded-3xl p-8">
            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">
                Decisões explicáveis
              </h2>
            </div>

            <p className="text-zinc-400 leading-relaxed">
              O SomAS procura responder não apenas “o que recomendar”, mas também “porquê recomendar”: que evidências foram usadas, qual o consenso existente e qual o nível de confiança da decisão.
            </p>
          </div>
        </section>

        <section className="mt-16 border border-amber-400/30 bg-amber-400/10 rounded-3xl p-8 md:p-10">
          <h2 className="text-3xl font-light">
            Missão
          </h2>

          <p className="text-xl text-zinc-200 mt-4 leading-relaxed">
            Dar ao vinho português uma inteligência coletiva capaz de preservar o conhecimento de hoje e criar as melhores decisões de amanhã.
          </p>

          <div className="mt-8 flex items-center gap-3 text-amber-400">
            <span className="font-medium">
              Knowledge → Evidence → Confidence → Decision → Explanation
            </span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </section>
      </section>
    </main>
  )
}

function CorePillar({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-700/60 rounded-2xl p-6">
      <div className="text-amber-400 mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="text-zinc-400 mt-3 text-sm leading-relaxed">
        {text}
      </p>
    </div>
  )
}

function UseCase({
  text,
}: {
  text: string
}) {
  return (
    <div className="flex items-start gap-3 text-zinc-300">
      <ArrowRight className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
      <span>{text}</span>
    </div>
  )
}
