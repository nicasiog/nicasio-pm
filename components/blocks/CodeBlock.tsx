type CodeValue = { language?: string; code: string }

export function CodeBlock({ value }: { value: CodeValue }) {
  if (!value?.code) return null
  return (
    <div className="glass overflow-hidden rounded-card">
      {value.language ? (
        <p className="eyebrow-sm border-b border-border bg-surface-2/80 px-5 py-2.5 text-text-muted">{value.language}</p>
      ) : null}
      <pre className="overflow-x-auto p-5 font-label text-sm leading-6 text-text">
        <code>{value.code}</code>
      </pre>
    </div>
  )
}
