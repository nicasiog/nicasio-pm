'use client'

import { Check, Copy, Mail } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/** Email row with a copy button. Announces "Copied" via aria-live for 2s. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current)
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <div className="glass flex items-center justify-between gap-3 rounded-tile p-3 pl-4">
      <a href={`mailto:${email}`} className="flex min-h-11 min-w-0 items-center gap-3 text-text">
        <Mail size={18} aria-hidden="true" className="shrink-0 text-tertiary" />
        <span className="truncate font-medium">{email}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-button border px-3 text-sm font-semibold transition-colors ${
          copied ? 'border-tertiary/40 bg-tertiary/10 text-tertiary' : 'border-border bg-surface-3 text-text hover:border-border-hover'
        }`}
      >
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </div>
  )
}
