import { SanityImage } from '@/components/SanityImage'
import type { SanityImage as SanityImageType } from '@/sanity/lib/types'

type FigureValue = SanityImageType & { caption?: string }

/** Framed image with optional caption. */
export function FigureBlock({ value }: { value: FigureValue }) {
  if (!value?.assetRef && !value?.asset?._ref) return null
  const ratio = value.width && value.height ? value.width / value.height : 16 / 9
  return (
    <figure className="glass flex flex-col gap-3 rounded-card p-3">
      <div className="relative w-full overflow-hidden rounded-tile" style={{ aspectRatio: ratio }}>
        <SanityImage image={value} sizes="(min-width: 1024px) 896px, 100vw" />
      </div>
      {value.caption ? <figcaption className="px-2 pb-1 text-sm text-text-muted">{value.caption}</figcaption> : null}
    </figure>
  )
}
