import { Brain } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
export default function DescriptorSelector({
  label,
  selectedDescriptors,
  setSelectedDescriptors,
}: {
  label: string
  selectedDescriptors: string[]
  setSelectedDescriptors: React.Dispatch<React.SetStateAction<string[]>>
}) {
  return (
    <Field label={label} icon={<Brain className="w-4 h-4" />}>
      <div className="space-y-6">
        {descriptorGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-3">{group.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.items.map((descriptor) => {
                const selected = selectedDescriptors.includes(descriptor.code)

                return (
                  <ChoiceButton
                    key={descriptor.code}
                    selected={selected}
                    onClick={() => {
                      setSelectedDescriptors((current) =>
                        selected
                          ? current.filter((code) => code !== descriptor.code)
                          : [...current, descriptor.code]
                      )
                    }}
                  >
                    <span className="font-mono text-amber-400 mr-2">{descriptor.code}</span>
                    <span className="text-sm text-zinc-300">{descriptor.label}</span>
                  </ChoiceButton>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </Field>
  )
}
