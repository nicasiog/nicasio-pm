import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'link'
type Arrow = 'right' | 'down' | 'external' | 'none'

type ButtonLinkProps = {
  href: string
  children: React.ReactNode
  variant?: Variant
  arrow?: Arrow
  external?: boolean
  className?: string
  icon?: React.ReactNode
}

const base =
  'group inline-flex min-h-11 items-center justify-center gap-2 font-semibold transition-all duration-200 whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary:
    'rounded-button bg-text px-5 py-2.5 text-bg font-bold hover:-translate-y-px hover:shadow-glow',
  secondary:
    'rounded-button bg-surface-3 px-5 py-2.5 text-text border border-border hover:border-border-hover',
  link: 'px-0 text-tertiary font-semibold',
}

const arrows: Record<Arrow, React.ReactNode> = {
  right: <ArrowRight aria-hidden="true" size={18} className="transition-transform duration-200 group-hover:translate-x-1" />,
  down: <ArrowDown aria-hidden="true" size={18} className="transition-transform duration-200 group-hover:translate-y-0.5" />,
  external: (
    <ArrowUpRight aria-hidden="true" size={18} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  ),
  none: null,
}

/** Primary, secondary and text-link buttons rendered as links (spec 7). */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  arrow = 'none',
  external = false,
  className = '',
  icon,
}: ButtonLinkProps) {
  const classes = `${base} ${variants[variant]} ${className}`
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {arrows[arrow]}
    </>
  )

  if (external || href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a href={href} className={classes} target={external || href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
