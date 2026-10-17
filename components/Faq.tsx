import { ChevronDown } from 'lucide-react'

import type { FaqItem } from '@/sanity/lib/types'

import { PortableText } from './PortableText'

/** Accordion built with native <details>/<summary>. */
export function Faq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <details key={item._key} className="glass group rounded-card open:border-border-hover">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-card px-5 py-4 font-display text-base font-semibold text-text [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown aria-hidden="true" size={18} className="shrink-0 text-tertiary transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-5 pb-5">
            <PortableText value={item.answer} className="gap-3 [&_p]:text-base" />
          </div>
        </details>
      ))}
    </div>
  )
}
