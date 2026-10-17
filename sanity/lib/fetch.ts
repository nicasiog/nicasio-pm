import 'server-only'

import type { QueryParams } from 'next-sanity'

import { client } from './client'
import { useSeedPreview } from './env'

type SanityFetchOptions = {
  query: string
  params?: QueryParams
  tags: string[]
}

/**
 * All reads go through here. Every query is cached by Next.js with
 * `force-cache` and tagged with the `_type` values it reads, so the webhook
 * at /api/revalidate can expire exactly the pages that changed.
 */
export async function sanityFetch<T>({ query, params = {}, tags }: SanityFetchOptions): Promise<T> {
  if (useSeedPreview) {
    const { seedFetch } = await import('./seed')
    return seedFetch<T>(query, params)
  }

  return client.fetch<T>(query, params, {
    cache: 'force-cache',
    next: { tags },
  })
}
