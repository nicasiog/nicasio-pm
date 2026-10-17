import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookBody = {
  _type: string
  slug?: string | null
}

/**
 * Sanity → Next.js webhook. Expires every cached query tagged with the
 * changed document's `_type` (and the project page itself for project
 * documents), so the next request renders fresh content.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ message: 'SANITY_REVALIDATE_SECRET is not set' }, { status: 500 })
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookBody>(req, secret)

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    if (!body?._type) {
      return NextResponse.json({ message: 'Missing _type' }, { status: 400 })
    }

    revalidateTag(body._type, { expire: 0 })

    if (body._type === 'project' && body.slug) {
      revalidatePath(`/projects/${body.slug}`)
    }

    return NextResponse.json({ revalidated: true, type: body._type, now: Date.now() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message }, { status: 500 })
  }
}
