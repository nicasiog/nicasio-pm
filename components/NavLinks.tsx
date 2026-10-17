'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { isActivePath, NAV_ITEMS } from './nav'

/** Desktop nav: active link is a filled surface-3 pill with aria-current. */
export function NavLinks({ onNavigate, className = '' }: { onNavigate?: () => void; className?: string }) {
  const pathname = usePathname()
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {NAV_ITEMS.map((item) => {
        const active = isActivePath(pathname, item.href)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`eyebrow inline-flex min-h-11 items-center rounded-full px-4 py-2 transition-colors ${
                active ? 'bg-surface-3 text-text' : 'text-text-muted hover:bg-surface-2 hover:text-text'
              }`}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
