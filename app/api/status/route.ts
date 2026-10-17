import { NextResponse } from 'next/server'

import { client } from '@/sanity/lib/client'
import { dataset, isSanityConfigured, projectId, useSeedPreview } from '@/sanity/lib/env'
import { sanityFetch } from '@/sanity/lib/fetch'

export const dynamic = 'force-dynamic'

/**
 * Setup diagnostics. Reports configuration (never secret values) and compares
 * the cached home headline with the live one in Sanity, so a stale cache is
 * easy to tell apart from a disconnected site.
 */
export async function GET() {
  const query = `*[_type == "homePage"][0].heroHeadline`
  let liveHeadline: string | null = null
  let cachedHeadline: string | null = null
  let sanityError: string | null = null

  try {
    if (!useSeedPreview) liveHeadline = await client.fetch<string | null>(query, {}, { cache: 'no-store' })
    cachedHeadline = await sanityFetch<string | null>({ query, tags: ['homePage'] })
  } catch (error) {
    sanityError = error instanceof Error ? error.message : String(error)
  }

  return NextResponse.json({
    dataSource: useSeedPreview ? 'seed file (Sanity NOT connected)' : 'sanity',
    projectIdSet: isSanityConfigured,
    projectId: isSanityConfigured ? projectId : null,
    dataset,
    revalidateSecretSet: Boolean(process.env.SANITY_REVALIDATE_SECRET),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    homeHeadline: { live: liveHeadline, cached: cachedHeadline, inSync: liveHeadline === cachedHeadline },
    sanityError,
  })
}
