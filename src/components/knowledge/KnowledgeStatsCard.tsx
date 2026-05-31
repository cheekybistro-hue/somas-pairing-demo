import { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  label: string
  value: string
  helper: string
}

export default function KnowledgeStatsCard({
  icon,
  label,
  value,
  helper,
}: Props) {
  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-5">
      <div className="flex items-center gap-2 text-amber-400 mb-3">
        {icon}
        <span className="text-xs uppercase tracking-widest text-zinc-400">
          {label}
        </span>
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
