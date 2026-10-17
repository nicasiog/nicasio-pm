import { IconTile } from '@/components/Icon'

type Card = { _key?: string; icon?: string; title: string; text: string; footnote?: string }
type CardGridValue = { items?: Card[] }

/** Problem or insight cards, 2–3 across. */
export function CardGridBlock({ value }: { value: CardGridValue }) {
  const items = value.items ?? []
  if (items.length === 0) return null
  return (
    <ul className={`grid grid-cols-1 gap-4 ${items.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
      {items.map((item) => (
        <li key={item._key ?? item.title} className="glass flex flex-col gap-3 rounded-card p-6">
          {item.icon ? <IconTile name={item.icon} /> : null}
          <h3 className="font-display text-title text-text">{item.title}</h3>
          <p className="text-text-muted">{item.text}</p>
          {item.footnote ? <p className="eyebrow-sm mt-auto pt-2 text-tertiary">{item.footnote}</p> : null}
        </li>
      ))}
    </ul>
  )
}
