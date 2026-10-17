import type { Metric } from '@/sanity/lib/types'

/** Centered 1200px container with 20px mobile / 24px desktop gutters. */
export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1248px] px-5 md:px-6 ${className}`}>{children}</div>
}

/** Vertical section rhythm: 64px on mobile, 96px on desktop. */
export function Section({
  children,
  className = '',
  id,
  ariaLabelledBy,
}: {
  children: React.ReactNode
  className?: string
  id?: string
  ariaLabelledBy?: string
}) {
  return (
    <section id={id} aria-labelledby={ariaLabelledBy} className={`py-16 md:py-24 ${className}`}>
      {children}
    </section>
  )
}

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`eyebrow text-tertiary ${className}`}>{children}</p>
}

export function Chip({
  children,
  tone = 'default',
  className = '',
}: {
  children: React.ReactNode
  tone?: 'default' | 'active' | 'accent'
  className?: string
}) {
  const tones = {
    default: 'border-border bg-surface-2 text-text-muted',
    active: 'border-primary-strong/40 bg-primary-strong/15 text-primary',
    accent: 'border-tertiary/30 bg-tertiary/10 text-tertiary',
  }
  return (
    <span
      className={`eyebrow-sm inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 normal-case tracking-normal ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

/** Pill with a pulsing cyan dot; used for availability and live status. */
export function StatusBadge({ children, pulse = true, className = '' }: { children: React.ReactNode; pulse?: boolean; className?: string }) {
  return (
    <span
      className={`eyebrow-sm inline-flex items-center gap-2 rounded-full border border-tertiary/30 bg-tertiary/10 px-3 py-1.5 text-tertiary ${className}`}
    >
      <span className={`h-2 w-2 rounded-full bg-tertiary ${pulse ? 'animate-pulse-dot' : ''}`} aria-hidden="true" />
      {children}
    </span>
  )
}

/** Value + small uppercase label (hero metrics, project stats, impact tiles). */
export function MetricTile({ metric, size = 'md' }: { metric: Metric; size?: 'sm' | 'md' | 'lg' }) {
  const valueSize = { sm: 'text-xl', md: 'text-headline-sm', lg: 'text-headline' }[size]
  return (
    <div className="flex flex-col gap-1 rounded-tile border border-border bg-surface-2/70 px-4 py-3">
      <span className={`font-display font-bold tracking-tight text-text ${valueSize}`}>{metric.value}</span>
      <span className="eyebrow-sm text-text-muted">{metric.label}</span>
      {metric.note ? <span className="text-sm text-text-muted">{metric.note}</span> : null}
    </div>
  )
}

/** Renders a heading with one phrase in the violet-to-cyan gradient. */
export function GradientHeading({
  text,
  highlight,
  as: Tag = 'h1',
  className = '',
  id,
  breakBefore = false,
}: {
  text: string
  highlight?: string | null
  as?: 'h1' | 'h2'
  className?: string
  id?: string
  breakBefore?: boolean
}) {
  if (!highlight || !text.includes(highlight)) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    )
  }
  const index = text.indexOf(highlight)
  const before = text.slice(0, index)
  const after = text.slice(index + highlight.length)
  return (
    <Tag id={id} className={className}>
      {before}
      {breakBefore && before.trim() ? <br className="hidden sm:inline" /> : null}
      <span className="gradient-text">{highlight}</span>
      {after}
    </Tag>
  )
}

/** Two static blurred radial gradients (violet, cyan) under 10% opacity. */
export function AmbientGlow({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -top-32 left-[10%] h-[28rem] w-[28rem] rounded-full bg-primary-strong/[0.09] blur-3xl" />
      <div className="absolute top-1/3 -right-24 h-[22rem] w-[22rem] rounded-full bg-tertiary/[0.07] blur-3xl" />
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  heading,
  intro,
  id,
  action,
}: {
  eyebrow?: string | null
  heading: string
  intro?: string | null
  id: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-2xl flex-col gap-3">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 id={id} className="font-display text-headline-sm text-text md:text-headline">
          {heading}
        </h2>
        {intro ? <p className="text-body-lg text-text-muted">{intro}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
