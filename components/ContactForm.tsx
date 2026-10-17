'use client'

import { CircleAlert, LoaderCircle, Send } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

type Values = { name: string; email: string; company: string; topic: string; message: string }
type Errors = Partial<Record<keyof Values, string>>
type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateField(field: keyof Values, value: string): string | undefined {
  const trimmed = value.trim()
  switch (field) {
    case 'name':
      if (!trimmed) return 'Please add your name.'
      if (trimmed.length > 100) return 'Keep your name under 100 characters.'
      return
    case 'email':
      if (!trimmed) return 'Please add your email.'
      if (!EMAIL.test(trimmed)) return 'That email doesn’t look right.'
      return
    case 'company':
      if (trimmed.length > 120) return 'Keep the company under 120 characters.'
      return
    case 'message':
      if (trimmed.length < 10) return 'Tell me a little more (at least 10 characters).'
      if (trimmed.length > 5000) return 'Keep the message under 5,000 characters.'
      return
    default:
      return
  }
}

function validateAll(values: Values): Errors {
  const errors: Errors = {}
  for (const key of Object.keys(values) as (keyof Values)[]) {
    const error = validateField(key, values[key])
    if (error) errors[key] = error
  }
  return errors
}

function ErrorText({ id, name, message }: { id: string; name: keyof Values; message?: string }) {
  if (!message) return null
  return (
    <p id={`${id}-${name}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
      <CircleAlert size={14} aria-hidden="true" />
      {message}
    </p>
  )
}

function Required() {
  return (
    <span className="text-tertiary" aria-hidden="true">
      {' '}
      *
    </span>
  )
}

const inputClass =
  'w-full rounded-tile border border-border bg-surface-2 px-4 py-3 text-text placeholder:text-text-muted/80 transition-colors focus-visible:border-tertiary/60 aria-[invalid=true]:border-danger/60'

type ContactFormProps = {
  heading: string
  intro?: string | null
  topics?: string[] | null
}

/**
 * Posts JSON straight to Formspree from the browser. Validates on blur and on
 * submit; idle → submitting → success (thank-you panel, focus moved) or error
 * (inline banner, values kept). A hidden `_gotcha` honeypot drops bots.
 */
export function ContactForm({ heading, intro, topics }: ContactFormProps) {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
  const id = useId()
  const [values, setValues] = useState<Values>({ name: '', email: '', company: '', topic: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const successRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!formId && process.env.NODE_ENV === 'development') {
      console.warn('NEXT_PUBLIC_FORMSPREE_FORM_ID is not set; the contact form is hidden.')
    }
  }, [formId])

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
    if (status === 'error') errorRef.current?.focus()
  }, [status])

  if (!formId) return null

  function update(field: keyof Values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
  }

  function blur(field: keyof Values) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values[field]) }))
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const honeypot = (form.elements.namedItem('_gotcha') as HTMLInputElement | null)?.value
    if (honeypot) return

    const nextErrors = validateAll(values)
    setErrors(nextErrors)
    setTouched({ name: true, email: true, company: true, topic: true, message: true })
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0]
      ;(form.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }

    setStatus('submitting')
    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim() || undefined,
          topic: values.topic || undefined,
          message: values.message.trim(),
          _subject: `Portfolio contact from ${values.name.trim()}`,
        }),
      })
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="glass flex flex-col gap-3 rounded-card border-t-2 border-t-tertiary p-8"
      >
        <p className="eyebrow text-tertiary">Message sent</p>
        <h2 className="font-display text-title text-text">Thanks, {values.name.trim()}.</h2>
        <p className="text-text-muted">Your message is on its way. I read everything and reply to real people.</p>
      </div>
    )
  }

  const field = (name: keyof Values) => ({
    id: `${id}-${name}`,
    name,
    value: values[name],
    onBlur: () => blur(name),
    'aria-invalid': Boolean(errors[name]) || undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
  })

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="glass relative flex flex-col gap-5 overflow-hidden rounded-card p-6 md:p-8"
      aria-labelledby={`${id}-heading`}
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary to-tertiary" />
      <div className="flex flex-col gap-2">
        <p className="eyebrow text-tertiary">Send a message</p>
        <h2 id={`${id}-heading`} className="font-display text-title text-text md:text-headline-sm">
          {heading}
        </h2>
        {intro ? <p className="text-text-muted">{intro}</p> : null}
        <p className="text-sm text-text-muted">
          <span className="text-tertiary" aria-hidden="true">
            *
          </span>{' '}
          Required
        </p>
      </div>

      {status === 'error' ? (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="flex items-start gap-3 rounded-tile border border-danger/40 bg-danger/10 p-4 text-sm text-text"
        >
          <CircleAlert size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-danger" />
          <span>Something went wrong sending that. Your message is still here, so try again in a moment.</span>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-medium text-text">
            Name
            <Required />
          </label>
          <input
            {...field('name')}
            type="text"
            autoComplete="name"
            maxLength={100}
            required
            placeholder="Your name"
            className={inputClass}
            onChange={(e) => update('name', e.target.value)}
          />
          <ErrorText id={id} name="name" message={errors.name} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-medium text-text">
            Email
            <Required />
          </label>
          <input
            {...field('email')}
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className={inputClass}
            onChange={(e) => update('email', e.target.value)}
          />
          <ErrorText id={id} name="email" message={errors.email} />
        </div>
        <div>
          <label htmlFor={`${id}-company`} className="mb-1.5 block text-sm font-medium text-text">
            Company
          </label>
          <input
            {...field('company')}
            type="text"
            autoComplete="organization"
            maxLength={120}
            placeholder="Where you work"
            className={inputClass}
            onChange={(e) => update('company', e.target.value)}
          />
          <ErrorText id={id} name="company" message={errors.company} />
        </div>
        <div>
          <label htmlFor={`${id}-topic`} className="mb-1.5 block text-sm font-medium text-text">
            Topic
          </label>
          <select {...field('topic')} className={inputClass} onChange={(e) => update('topic', e.target.value)}>
            <option value="">Choose one (optional)</option>
            {(topics ?? []).map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor={`${id}-message`} className="mb-1.5 block text-sm font-medium text-text">
            Message
            <Required />
          </label>
          <textarea
            {...field('message')}
            rows={6}
            minLength={10}
            maxLength={5000}
            required
            placeholder="What are you working on, and how can I help?"
            className={`${inputClass} resize-y`}
            onChange={(e) => update('message', e.target.value)}
          />
          <ErrorText id={id} name="message" message={errors.message} />
        </div>
      </div>

      {/* Honeypot: hidden from people, filled in by bots. Formspree drops any submission with it set. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label htmlFor={`${id}-gotcha`}>Leave this empty</label>
        <input id={`${id}-gotcha`} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex min-h-11 items-center gap-2 rounded-button bg-text px-5 py-2.5 font-bold text-bg transition-all hover:-translate-y-px hover:shadow-glow disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {status === 'submitting' ? (
            <>
              <LoaderCircle size={18} aria-hidden="true" className="animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send size={18} aria-hidden="true" />
              Send message
            </>
          )}
        </button>
      </div>
    </form>
  )
}
