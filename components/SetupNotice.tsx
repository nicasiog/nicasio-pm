import { Container } from './ui'

/**
 * Shown only when a required Sanity document is missing (for example before
 * the seed import has run). Never shown once content exists.
 */
export function SetupNotice({ document }: { document: string }) {
  return (
    <Container className="py-24">
      <div className="glass mx-auto max-w-xl rounded-card p-8">
        <p className="eyebrow mb-3 text-tertiary">Content missing</p>
        <h1 className="font-display text-title text-text">No “{document}” document found in Sanity.</h1>
        <p className="mt-3 text-text-muted">
          Import the seed content or create it in <code className="font-label text-primary">/studio</code>, then publish.
        </p>
      </div>
    </Container>
  )
}
