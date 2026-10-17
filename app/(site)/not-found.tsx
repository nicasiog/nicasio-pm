import { ButtonLink } from '@/components/Button'
import { AmbientGlow, Container } from '@/components/ui'

export default function NotFound() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="not-found-heading">
      <AmbientGlow />
      <Container className="relative flex min-h-[60vh] flex-col items-start justify-center gap-5 py-24">
        <p className="eyebrow text-tertiary">404</p>
        <h1 id="not-found-heading" className="font-display text-display-sm text-text md:text-display">
          That page isn’t here.
        </h1>
        <p className="max-w-md text-body-lg text-text-muted">The link may be out of date, or the project may have moved.</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="primary" arrow="right">
            Back home
          </ButtonLink>
          <ButtonLink href="/projects" variant="secondary">
            See projects
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
