import { createImageUrlBuilder } from '@sanity/image-url'
import type { ImageLoaderProps } from 'next/image'

// This file is referenced from next.config.ts (images.loaderFile) and runs in
// the browser, so it must not import anything server-only.
const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
})

/**
 * Builds a Sanity CDN URL for next/image. `src` is the base CDN URL produced by
 * <SanityImage>, which may carry a `rect=` crop; that crop is preserved while
 * the CDN handles resizing and WebP/AVIF negotiation (`auto=format`).
 */
export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.includes('cdn.sanity.io')) return src

  const [base, queryString] = src.split('?')
  const incoming = new URLSearchParams(queryString ?? '')

  const url = new URL(builder.image(base).width(width).quality(quality ?? 80).auto('format').url())
  const rect = incoming.get('rect')
  if (rect) url.searchParams.set('rect', rect)

  return url.toString()
}
