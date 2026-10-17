export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-01'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Falls back to a placeholder so the Studio and client can be constructed
// without crashing; sanityFetch() switches to seed-preview mode when unset.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'

export const isSanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)

/**
 * Seed-preview mode serves the content in `seed/content.ndjson` straight from
 * disk. It turns on automatically when no project ID is set, or explicitly with
 * `SANITY_SEED_PREVIEW=true`, so the site can be run with zero accounts.
 */
export const useSeedPreview =
  process.env.SANITY_SEED_PREVIEW === 'true' || !isSanityConfigured

export const readToken = process.env.SANITY_API_READ_TOKEN
