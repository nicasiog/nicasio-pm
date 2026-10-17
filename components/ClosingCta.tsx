import { ButtonLink } from './Button'
import { AmbientGlow, Container, StatusBadge } from './ui'

type CtaButton = { href: string; label: string; external?: boolean }

type ClosingCtaProps = {
  heading: string
  body?: string | null
  badge?: string | null
  primary: CtaButton
  secondary?: CtaButton | null
  tertiary?: CtaButton | null
}

/** Shared closing panel: glass, soft radial glow, H2, one line, two buttons. */
export function ClosingCta({ heading, body, badge, primary, secondary, tertiary }: ClosingCtaProps) {
  return (
    <section aria-labelledby="closing-cta-heading" className="pb-16 md:pb-24">
      <Container>
        <div className="glass relative overflow-hidden rounded-card px-6 py-14 text-center md:px-12 md:py-20">
          <AmbientGlow />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            {badge ? <StatusBadge>{badge}</StatusBadge> : null}
            <h2 id="closing-cta-heading" className="font-display text-headline-sm text-text md:text-headline">
              {heading}
            </h2>
            {body ? <p className="text-body-lg text-text-muted">{body}</p> : null}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href={primary.href} variant="primary" arrow="right" external={primary.external}>
                {primary.label}
              </ButtonLink>
              {secondary ? (
                <ButtonLink href={secondary.href} variant="secondary" external={secondary.external}>
                  {secondary.label}
                </ButtonLink>
              ) : null}
              {tertiary ? (
                <ButtonLink href={tertiary.href} variant="link" arrow="external" external={tertiary.external}>
                  {tertiary.label}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
