'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { isActivePath, NAV_ITEMS } from './nav'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

type MobileMenuProps = {
  resumeUrl?: string | null
}

/**
 * Below 1024px: a menu button opens a full-width panel with the three nav
 * links and both header buttons. Escape and link clicks close it; focus is
 * trapped while open and returned to the button on close.
 */
export function MobileMenu({ resumeUrl }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const close = useCallback(() => {
    setOpen(false)
    buttonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusable.length === 0) return
      const firstEl = focusable[0]
      const lastEl = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault()
        lastEl.focus()
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, close])

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close() : setOpen(true))}
        className="inline-flex h-11 w-11 items-center justify-center rounded-button border border-border bg-surface-2 text-text"
      >
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>

      <div
        id={panelId}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        hidden={!open}
        className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-xl"
      >
        <nav aria-label="Mobile" className="mx-auto flex w-full max-w-[1248px] flex-col gap-2 px-5 py-6">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? 'page' : undefined}
                    className={`eyebrow flex min-h-12 items-center rounded-button px-4 ${
                      active ? 'bg-surface-3 text-text' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-5">
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="inline-flex min-h-12 items-center justify-center rounded-button border border-border bg-surface-3 px-5 font-semibold text-text"
              >
                Resume
              </a>
            ) : null}
            <Link
              href="/contact"
              onClick={close}
              className="inline-flex min-h-12 items-center justify-center rounded-button bg-text px-5 font-bold text-bg"
            >
              Get in Touch
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
