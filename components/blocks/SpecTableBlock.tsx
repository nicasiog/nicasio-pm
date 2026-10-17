type Row = { _key?: string; label: string; value: string; note?: string }
type SpecTableValue = { title?: string; rows?: Row[] }

/** Label / value grid. */
export function SpecTableBlock({ value }: { value: SpecTableValue }) {
  const rows = value.rows ?? []
  if (rows.length === 0) return null
  return (
    <div className="glass overflow-hidden rounded-card">
      {value.title ? (
        <p className="eyebrow border-b border-border px-5 py-3 text-text-muted">{value.title}</p>
      ) : null}
      <dl className="divide-y divide-border">
        {rows.map((row) => (
          <div key={row._key ?? row.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-6">
            <dt className="eyebrow-sm pt-0.5 text-text-muted">{row.label}</dt>
            <dd className="flex flex-col gap-0.5">
              <span className="font-medium text-text">{row.value}</span>
              {row.note ? <span className="text-sm text-text-muted">{row.note}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
