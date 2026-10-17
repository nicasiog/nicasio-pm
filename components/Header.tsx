import Link from 'next/link'

import type { SiteSettings } from '@/sanity/lib/types'

import { ButtonLink } from './Button'
import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'

export function Header({ settings }: { settings: SiteSettings }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full w-full max-w-[1248px] items-center justify-between gap-4 px-5 md:px-6">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-button">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-3 font-display text-sm font-bold tracking-tight text-primary"
          >
            {settings.monogram}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold tracking-tight text-text">{settings.name}</span>
            <span className="eyebrow-sm text-tertiary">{settings.role}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <NavLinks />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {settings.resumeUrl ? (
            <ButtonLink href={settings.resumeUrl} variant="secondary" external className="px-4 py-2 text-sm">
              Resume
            </ButtonLink>
          ) : null}
          <ButtonLink href="/contact" variant="primary" className="px-4 py-2 text-sm">
            Get in Touch
          </ButtonLink>
        </div>

        <MobileMenu resumeUrl={settings.resumeUrl} />
      </div>
    </header>
  )
}
