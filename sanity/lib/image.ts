import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import { dataset, projectId } from './env'
import type { SanityImage as SanityImageType } from './types'

const builder = createImageUrlBuilder({ projectId, dataset })

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/** Strips a projected image down to what the URL builder understands (asset, hotspot, crop). */
export function toSource(image: SanityImageType | null | undefined): SanityImageSource | null {
  const ref = image?.asset?._ref ?? image?.assetRef
  if (!image || !ref) return null
  return {
    asset: { _ref: ref },
    hotspot: image.hotspot ?? undefined,
    crop: image.crop ?? undefined,
  }
}

/** 1200×630 crop for Open Graph and Twitter cards, served by the Sanity CDN. */
export function ogImageUrl(image: SanityImageType | null | undefined) {
  const source = toSource(image)
  if (!source) return undefined
  return urlFor(source).width(1200).height(630).fit('crop').auto('format').url()
}
