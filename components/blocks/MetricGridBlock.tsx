import type { Metric } from '@/sanity/lib/types'

type MetricGridValue = { items?: Metric[] }

/** Large gradient numbers in glass tiles. */
export function MetricGridBlock({ value }: { value: MetricGridValue }) {
  const items = value.items ?? []
  if (items.length === 0) return null
  const cols = items.length >= 4 ? 'lg:grid-cols-4' : items.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
  return (
    <ul className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${cols}`}>
      {items.map((item) => (
        <li key={item._key ?? item.label} className="glass flex flex-col gap-1 rounded-card p-6">
          <span className="gradient-text font-display text-headline font-extrabold tracking-tight">{item.value}</span>
          <span className="eyebrow-sm text-text">{item.label}</span>
          {item.note ? <span className="text-sm text-text-muted">{item.note}</span> : null}
        </li>
      ))}
    </ul>
  )
}
