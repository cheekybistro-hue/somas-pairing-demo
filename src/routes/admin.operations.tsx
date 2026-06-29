import { createFileRoute } from '@tanstack/react-router'
import {
  Download,
  FileJson,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'

import {
  buildKnowledgePassport,
  type KnowledgePassport,
} from '@/lib/knowledge/knowledge-passport'

export const Route = createFileRoute('/admin/operations')({
  component: AdminOperationsPage,
})

function AdminOperationsPage() {
  const [passport, setPassport] =
    useState<KnowledgePassport | null>(null)

  const [isGenerating, setIsGenerating] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  async function handleGeneratePassport() {
    setIsGenerating(true)
    setError(null)

    try {
      const generatedPassport =
        await buildKnowledgePassport()

      setPassport(generatedPassport)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível gerar o Knowledge Passport.'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleDownloadPassport() {
    const currentPassport =
      passport ?? (await buildKnowledgePassport())

    if (!passport) {
      setPassport(currentPassport)
    }

    const blob = new Blob(
      [JSON.stringify(currentPassport, null, 2)],
      { type: 'application/json' }
    )

    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href = url
    link.download = `${currentPassport.id}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
          SomAS Admin
        </p>

        <h1 className="mt-3 text-4xl font-light">
          Knowledge Operations
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
          Centro operacional para gerar Knowledge Passports, preservar versões
          consistentes da base colaborativa e alimentar o SomAS Core Decision
          Engine.
        </p>

        <section className="mt-10 rounded-2xl border border-zinc-700 bg-zinc-900/60 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3 text-amber-400">
                <PackageCheck className="h-6 w-6" />

                <p className="text-xs font-semibold uppercase tracking-[0.25em]">
                  Knowledge Passport
                </p>
              </div>

              <h2 className="mt-4 text-2xl font-semibold">
                Ponte oficial para o SomAS Core
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                O Knowledge Passport representa um estado consistente da base
                de conhecimento colaborativa. É a interface de transferência
                entre o SomAS Knowledge Portal e o SomAS Core Decision Engine.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleGeneratePassport}
                disabled={isGenerating}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400 px-5 py-3 text-sm font-semibold text-amber-400 hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className="h-4 w-4" />
                {isGenerating
                  ? 'A gerar...'
                  : 'Generate Knowledge Passport'}
              </button>

              <button
                type="button"
                onClick={handleDownloadPassport}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
              >
                <Download className="h-4 w-4" />
                Download JSON
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-5">
            <MetricCard
              label="Answers"
              value={passport?.metadata.totalAnswers ?? '—'}
            />

            <MetricCard
              label="Experts"
              value={passport?.metadata.totalExperts ?? '—'}
            />

            <MetricCard
              label="Modules"
              value={passport?.metadata.totalModules ?? '—'}
            />

            <MetricCard
              label="Questions"
              value={passport?.metadata.totalQuestions ?? '—'}
            />

            <MetricCard
              label="Progress"
              value={passport?.metadata.totalProgress ?? '—'}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <InfoCard
              icon={<FileJson className="h-5 w-5" />}
              title="Formato"
              value="JSON"
              description="Formato simples para backup, análise e importação futura no SomAS Core."
            />

            <InfoCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Schema"
              value={passport ? `v${passport.schemaVersion}` : 'v1'}
              description="A estrutura do Knowledge Passport é versionada para garantir compatibilidade futura."
            />

            <InfoCard
              icon={<PackageCheck className="h-5 w-5" />}
              title="Knowledge Version"
              value={passport?.knowledgeVersion ?? 'Ainda não gerado'}
              description="Cada geração cria uma versão temporal do conhecimento disponível no portal."
            />
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-700 bg-zinc-900/40 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            Knowledge Flow
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-zinc-300 md:grid-cols-5">
            <FlowStep text="Especialistas" />
            <FlowStep text="Knowledge Portal" />
            <FlowStep text="Knowledge Passport" />
            <FlowStep text="SomAS Core" />
            <FlowStep text="Digital Wine Passport" />
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-700 bg-zinc-900/40 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Future Operations
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-zinc-400 md:grid-cols-3">
            <FutureItem text="Download ZIP" />
            <FutureItem text="Validate Passport" />
            <FutureItem text="Push to SomAS Core" />
            <FutureItem text="Compare Versions" />
            <FutureItem text="Passport History" />
            <FutureItem text="Checksum & Signature" />
          </div>
        </section>
      </section>
    </main>
  )
}

function MetricCard({
  label,
  value,
}: {
  label: string
  value: number | string
}) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4">
      <p className="text-xs uppercase tracking-widest text-zinc-500">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold text-zinc-100">
        {value}
      </p>
    </div>
  )
}

function InfoCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode
  title: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-5">
      <div className="flex items-center gap-2 text-amber-400">
        {icon}
        <p className="text-xs uppercase tracking-widest">
          {title}
        </p>
      </div>

      <p className="mt-4 text-lg font-semibold">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {description}
      </p>
    </div>
  )
}

function FlowStep({
  text,
}: {
  text: string
}) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4 text-center">
      {text}
    </div>
  )
}

function FutureItem({
  text,
}: {
  text: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-700 p-4">
      {text}
    </div>
  )
}
