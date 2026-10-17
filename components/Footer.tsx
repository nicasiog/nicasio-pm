import { Mail } from 'lucide-react'
import Link from 'next/link'

import type { SiteSettings } from '@/sanity/lib/types'

import { GitHubIcon, LinkedInIcon } from './icons/Brand'
import { NAV_ITEMS } from './nav'
import { StatusBadge } from './ui'

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear()
  const availability = settings.availability
  const showAvailability = Boolean(availability?.show && availability?.label)

  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto w-full max-w-[1248px] px-5 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col items-start gap-4">
            <p className="font-display text-title text-text">{settings.name}</p>
            {showAvailability ? <StatusBadge>{availability?.label}</StatusBadge> : null}
            {settings.footerBio ? <p className="max-w-xs text-sm text-text-muted">{settings.footerBio}</p> : null}
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow mb-4 text-text-muted">Navigate</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/" className="inline-flex min-h-11 items-center text-text-muted transition-colors hover:text-text">
                  Home
                </Link>
              </li>
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-11 items-center text-text-muted transition-colors hover:text-text">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-4 text-text-muted">Connect</p>
            <ul className="flex flex-col gap-2">
              {settings.linkedinUrl ? (
                <li>
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 text-text-muted transition-colors hover:text-text"
                  >
                    <LinkedInIcon /> LinkedIn
                  </a>
                </li>
              ) : null}
              {settings.githubUrl ? (
                <li>
                  <a
                    href={settings.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 text-text-muted transition-colors hover:text-text"
                  >
                    <GitHubIcon /> GitHub
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex min-h-11 items-center gap-2 text-text-muted transition-colors hover:text-text"
                >
                  <Mail size={18} aria-hidden="true" /> {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-sm text-text-muted">
          © {year} {settings.name}
        </div>
      </div>
    </footer>
  )
}
