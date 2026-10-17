import Image from 'next/image'

import { toSource, urlFor } from '@/sanity/lib/image'
import type { SanityImage as SanityImageType } from '@/sanity/lib/types'

type SanityImageProps = {
  image?: SanityImageType | null
  alt?: string
  className?: string
  sizes?: string
  priority?: boolean
  /** Fill its (positioned) parent and cover it. Default. */
  fill?: boolean
  width?: number
  height?: number
}

/**
 * next/image backed by the Sanity CDN. The base URL (with any editor crop as
 * `rect=`) goes through sanity/lib/imageLoader.ts, which adds width, quality
 * and `auto=format`. The hotspot becomes `object-position`, and the LQIP from
 * Sanity's metadata is the blur placeholder.
 */
export function SanityImage({
  image,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
  fill = true,
  width,
  height,
}: SanityImageProps) {
  const source = toSource(image)
  if (!image || !source) return null

  const src = urlFor(source).url()
  const objectPosition = image.hotspot ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` : '50% 50%'
  const altText = alt ?? image.alt ?? ''
  const blur = image.lqip ? { placeholder: 'blur' as const, blurDataURL: image.lqip } : {}

  if (fill) {
    return (
      <Image
        src={src}
        alt={altText}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
        style={{ objectPosition }}
        {...blur}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={altText}
      width={width ?? image.width ?? 1200}
      height={height ?? image.height ?? 800}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectPosition }}
      {...blur}
    />
  )
}

/** Placeholder frame for when no image has been uploaded yet. */
export function ImageFallback({ label, className = '' }: { label?: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_top_left,rgba(128,131,255,0.18),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(76,215,246,0.14),transparent_60%)] bg-surface-2 ${className}`}
    >
      {label ? <span className="eyebrow-sm text-text-muted">{label}</span> : null}
    </div>
  )
}
