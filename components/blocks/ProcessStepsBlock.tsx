type Step = { _key?: string; label?: string; title: string; text?: string; tool?: string }
type ProcessStepsValue = { title?: string; steps?: Step[] }

/** Numbered pipeline inside a code-window frame. */
export function ProcessStepsBlock({ value }: { value: ProcessStepsValue }) {
  const steps = value.steps ?? []
  if (steps.length === 0) return null
  return (
    <figure className="glass overflow-hidden rounded-card">
      <figcaption className="flex items-center gap-3 border-b border-border bg-surface-2/80 px-5 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-text-subtle/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-text-subtle/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-text-subtle/60" />
        </span>
        <span className="font-label text-sm text-text-muted">{value.title ?? 'Process'}</span>
      </figcaption>
      <ol className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step._key ?? step.title} className="flex flex-col gap-2 bg-bg/70 p-5">
            <div className="flex items-center justify-between">
              <span className="font-label text-sm font-semibold text-tertiary">
                {String(index + 1).padStart(2, '0')}
                {step.label ? ` // ${step.label.toUpperCase()}` : ''}
              </span>
              {step.tool ? (
                <span className="eyebrow-sm rounded-full border border-border bg-surface-2 px-2 py-0.5 text-text-muted">{step.tool}</span>
              ) : null}
            </div>
            <h3 className="font-display text-base font-semibold text-text">{step.title}</h3>
            {step.text ? <p className="text-sm text-text-muted">{step.text}</p> : null}
          </li>
        ))}
      </ol>
    </figure>
  )
}
