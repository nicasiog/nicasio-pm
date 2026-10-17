import { IconTile } from '@/components/Icon'

type Highlight = { _key?: string; icon?: string; eyebrow?: string; title: string; text: string }
type HighlightPairValue = { items?: Highlight[] }

/** One or two accent-bordered takeaway cards. */
export function HighlightPairBlock({ value }: { value: HighlightPairValue }) {
  const items = value.items ?? []
  if (items.length === 0) return null
  return (
    <ul className={`grid grid-cols-1 gap-4 ${items.length > 1 ? 'md:grid-cols-2' : ''}`}>
      {items.map((item, index) => (
        <li
          key={item._key ?? item.title}
          className={`glass flex flex-col gap-3 rounded-card border-l-2 p-6 ${index % 2 === 0 ? 'border-l-primary-strong' : 'border-l-tertiary'}`}
        >
          <div className="flex items-center gap-3">
            {item.icon ? <IconTile name={item.icon} /> : null}
            {item.eyebrow ? <p className="eyebrow-sm text-tertiary">{item.eyebrow}</p> : null}
          </div>
          <h3 className="font-display text-title text-text">{item.title}</h3>
          <p className="text-text-muted">{item.text}</p>
        </li>
      ))}
    </ul>
  )
}
