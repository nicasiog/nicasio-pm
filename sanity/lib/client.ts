import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, readToken } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Next.js is the cache layer. Reading from Sanity's API CDN right after a
  // publish could re-cache the previous version, so always hit the live API.
  useCdn: false,
  token: readToken || undefined,
  perspective: 'published',
})
