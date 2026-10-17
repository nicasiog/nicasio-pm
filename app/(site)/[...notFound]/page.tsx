import { notFound } from 'next/navigation'

/** Catch-all so unmatched URLs render the branded not-found page inside the site layout. */
export default function CatchAllPage() {
  notFound()
}
