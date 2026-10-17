import type { Metadata } from 'next'
import { Calendar, ExternalLink, MapPin } from 'lucide-react'

import { ContactForm } from '@/components/ContactForm'
import { CopyEmail } from '@/components/CopyEmail'
import { Faq } from '@/components/Faq'
import { GitHubIcon, LinkedInIcon } from '@/components/icons/Brand'
import { Reveal } from '@/components/motion/Reveal'
import { SetupNotice } from '@/components/SetupNotice'
import { Chip, Container, Eyebrow, GradientHeading, Section, SectionHeading, StatusBadge } from '@/components/ui'
import { sanityFetch } from '@/sanity/lib/fetch'
import { contactPageQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import type { ContactPage, SiteSettings } from '@/sanity/lib/types'

const TAGS = ['contactPage', 'siteSettings']

async function getData() {
  const [page, settings] = await Promise.all([
    sanityFetch<ContactPage | null>({ query: contactPageQuery, tags: TAGS }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: TAGS }),
  ])
  return { page, settings }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getData()
  return {
    title: 'Contact',
    description: page?.intro ?? undefined,
    alternates: { canonical: '/contact' },
    openGraph: { title: 'Contact', description: page?.intro ?? undefined },
  }
}

function ChannelTile({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="glass card-hover flex min-h-14 items-center justify-between gap-3 rounded-tile px-4 py-3 text-text"
    >
      <span className="flex items-center gap-3 font-medium">
        <span className="text-tertiary">{icon}</span>
        {label}
      </span>
      <ExternalLink size={16} aria-hidden="true" className="text-text-muted" />
    </a>
  )
}

export default async function ContactPageRoute() {
  const { page, settings } = await getData()
  if (!page || !settings) return <SetupNotice document={page ? 'siteSettings' : 'contactPage'} />

  const availability = settings.availability
  const showAvailability = Boolean(availability?.show)
  const faq = page.faq ?? []
  const hasForm = Boolean(process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID)

  return (
    <>
      <Section ariaLabelledBy="contact-heading" className="pb-10 md:pb-12">
        <Container>
          <div className="flex max-w-3xl flex-col gap-5">
            <div>
              <Chip tone="accent">Contact</Chip>
            </div>
            <GradientHeading
              id="contact-heading"
              text={page.heading}
              highlight={page.highlight}
              className="font-display text-display-sm text-text md:text-display"
            />
            {page.intro ? <p className="text-body-lg text-text-muted">{page.intro}</p> : null}
          </div>
        </Container>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Form first in the DOM and on mobile; right column on desktop. */}
            <div className={`flex flex-col gap-6 lg:order-2 lg:col-span-7 ${hasForm || settings.bookingUrl ? '' : 'lg:hidden'}`}>
              {hasForm ? <ContactForm heading={page.formHeading} intro={page.formIntro} topics={page.topics} /> : null}
              {settings.bookingUrl ? (
                <div className="glass flex flex-col gap-3 rounded-card p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-tile bg-primary-strong/12 text-primary">
                      <Calendar size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-text">Prefer a call?</p>
                      <p className="text-sm text-text-muted">Pick a time that works and we’ll talk it through.</p>
                    </div>
                  </div>
                  <a
                    href={settings.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-border bg-surface-3 px-4 font-semibold text-text transition-colors hover:border-border-hover"
                  >
                    Book a time <ExternalLink size={16} aria-hidden="true" />
                  </a>
                </div>
              ) : null}
            </div>

            <div className={`flex flex-col gap-6 lg:order-1 ${hasForm || settings.bookingUrl ? 'lg:col-span-5' : 'lg:col-span-8'}`}>
              {showAvailability ? (
                <div className="glass flex flex-col gap-4 rounded-card p-6">
                  {availability?.label ? <StatusBadge>{availability.label}</StatusBadge> : null}
                  {availability?.targetRoles ? (
                    <div>
                      <p className="eyebrow-sm mb-1 text-text-muted">Looking for</p>
                      <p className="font-display text-title text-text">{availability.targetRoles}</p>
                    </div>
                  ) : null}
                  {availability?.details ? <p className="text-text-muted">{availability.details}</p> : null}
                  {settings.location || availability?.workStyle ? (
                    <div className="flex flex-wrap gap-2">
                      {settings.location ? (
                        <Chip>
                          <MapPin size={14} aria-hidden="true" className="text-primary" />
                          {settings.location}
                        </Chip>
                      ) : null}
                      {availability?.workStyle ? <Chip>{availability.workStyle}</Chip> : null}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-col gap-3">
                <Eyebrow className="text-text-muted">Direct channels</Eyebrow>
                <CopyEmail email={settings.email} />
                {settings.linkedinUrl ? <ChannelTile href={settings.linkedinUrl} label="LinkedIn" icon={<LinkedInIcon />} /> : null}
                {settings.githubUrl ? <ChannelTile href={settings.githubUrl} label="GitHub" icon={<GitHubIcon />} /> : null}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {faq.length > 0 ? (
        <Section ariaLabelledBy="faq-heading" className="pt-0 md:pt-0">
          <Container>
            <Reveal className="mx-auto max-w-3xl">
              <SectionHeading id="faq-heading" eyebrow="Before you write" heading="Frequently asked" />
              <Faq items={faq} />
            </Reveal>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
