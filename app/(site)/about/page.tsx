import type { Metadata } from 'next'
import { Download, Mail, MapPin } from 'lucide-react'

import { ButtonLink } from '@/components/Button'
import { ClosingCta } from '@/components/ClosingCta'
import { Icon, IconTile } from '@/components/Icon'
import { HeroItem } from '@/components/motion/HeroSequence'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { PortableText } from '@/components/PortableText'
import { ImageFallback, SanityImage } from '@/components/SanityImage'
import { SetupNotice } from '@/components/SetupNotice'
import { Chip, Container, GradientHeading, MetricTile, Section, SectionHeading, StatusBadge } from '@/components/ui'
import { sanityFetch } from '@/sanity/lib/fetch'
import { aboutPageQuery, educationQuery, experienceQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import type { AboutPage, Education, Experience, SiteSettings } from '@/sanity/lib/types'

const TAGS = ['aboutPage', 'experience', 'education', 'siteSettings']
const MAX_STACK = 8

async function getData() {
  const [page, experience, education, settings] = await Promise.all([
    sanityFetch<AboutPage | null>({ query: aboutPageQuery, tags: TAGS }),
    sanityFetch<Experience[]>({ query: experienceQuery, tags: TAGS }),
    sanityFetch<Education[]>({ query: educationQuery, tags: TAGS }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: TAGS }),
  ])
  return { page, experience: experience ?? [], education: education ?? [], settings }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getData()
  return {
    title: 'About',
    description: page?.intro ?? undefined,
    alternates: { canonical: '/about' },
    openGraph: { title: 'About', description: page?.intro ?? undefined },
  }
}

function formatRange(start: string, end?: string | null) {
  const fmt = (value: string) =>
    new Date(`${value.length === 7 ? `${value}-01` : value}T00:00:00Z`).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
  return `${fmt(start)} – ${end ? fmt(end) : 'Present'}`
}

export default async function AboutPageRoute() {
  const { page, experience, education, settings } = await getData()
  if (!page || !settings) return <SetupNotice document={page ? 'siteSettings' : 'aboutPage'} />

  const availability = settings.availability
  const showAvailability = Boolean(availability?.show && availability?.label)
  const metrics = (page.metrics ?? []).slice(0, 3)
  const stack = page.coreStack ?? []
  const visibleStack = stack.slice(0, MAX_STACK)
  const extraStack = stack.length - visibleStack.length
  const principles = (page.principles ?? []).slice(0, 4)
  const skills = page.skills ?? []

  return (
    <>
      <section aria-labelledby="about-heading" className="relative">
        <Container className="pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="grid items-start gap-12 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-8">
              <HeroItem index={0}>
                <Chip tone="accent">About</Chip>
              </HeroItem>
              <HeroItem index={1}>
                <GradientHeading
                  id="about-heading"
                  text={page.heading}
                  highlight={page.highlight}
                  className="font-display text-display-sm text-text md:text-display"
                />
              </HeroItem>
              {page.intro ? (
                <HeroItem index={2}>
                  <p className="max-w-2xl text-body-lg text-text-muted">{page.intro}</p>
                </HeroItem>
              ) : null}
              {settings.location || showAvailability ? (
                <HeroItem index={3}>
                  <div className="flex flex-wrap items-center gap-2">
                    {settings.location ? (
                      <Chip>
                        <MapPin size={14} aria-hidden="true" className="text-primary" />
                        {settings.location}
                      </Chip>
                    ) : null}
                    {showAvailability ? <StatusBadge>{availability?.label}</StatusBadge> : null}
                  </div>
                </HeroItem>
              ) : null}
              {metrics.length > 0 ? (
                <HeroItem index={4}>
                  <ul className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Highlights">
                    {metrics.map((metric) => (
                      <li key={metric._key ?? metric.label}>
                        <MetricTile metric={metric} />
                      </li>
                    ))}
                  </ul>
                </HeroItem>
              ) : null}
            </div>

            <HeroItem index={5} className="lg:col-span-4">
              <div className="glass mx-auto flex w-full max-w-[360px] flex-col gap-4 rounded-card p-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-tile">
                  {page.photo?.assetRef ? (
                    <SanityImage image={page.photo} sizes="(min-width: 1024px) 336px, 90vw" priority />
                  ) : (
                    <ImageFallback label="Photo" />
                  )}
                </div>
                <div className="flex flex-col gap-4 px-2 pb-2">
                  <div>
                    <p className="font-display text-title text-text">{settings.name}</p>
                    <p className="eyebrow-sm text-tertiary">{settings.role}</p>
                  </div>
                  {visibleStack.length > 0 ? (
                    <div>
                      <p className="eyebrow-sm mb-2 text-text-muted">Core stack</p>
                      <ul className="flex flex-wrap gap-1.5">
                        {visibleStack.map((item) => (
                          <li key={item}>
                            <Chip>{item}</Chip>
                          </li>
                        ))}
                        {extraStack > 0 ? (
                          <li>
                            <Chip tone="accent">+{extraStack}</Chip>
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-2">
                    <ButtonLink href={`mailto:${settings.email}`} variant="primary" icon={<Mail size={16} aria-hidden="true" />}>
                      Email me
                    </ButtonLink>
                    {settings.resumeUrl ? (
                      <ButtonLink href={settings.resumeUrl} variant="secondary" external icon={<Download size={16} aria-hidden="true" />}>
                        Download resume
                      </ButtonLink>
                    ) : null}
                  </div>
                </div>
              </div>
            </HeroItem>
          </div>
        </Container>
      </section>

      {page.bio && page.bio.length > 0 ? (
        <Section className="pt-0 md:pt-0" ariaLabelledBy="bio-heading">
          <Container>
            <Reveal>
              <h2 id="bio-heading" className="sr-only">
                Bio
              </h2>
              <PortableText value={page.bio} className="mx-auto max-w-[68ch]" />
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {principles.length > 0 ? (
        <Section ariaLabelledBy="principles-heading" className="pt-0 md:pt-0">
          <Container>
            <Reveal>
              <SectionHeading id="principles-heading" eyebrow="How I work" heading="Principles" />
            </Reveal>
            <Stagger as="ul" className="grid gap-6 md:grid-cols-2">
              {principles.map((principle) => (
                <StaggerItem as="li" key={principle._key} className="glass flex flex-col gap-3 rounded-card p-6">
                  <div className="flex items-center justify-between">
                    <IconTile name={principle.icon} />
                    {principle.label ? <span className="eyebrow-sm text-text-muted">{principle.label}</span> : null}
                  </div>
                  <h3 className="font-display text-title text-text">{principle.title}</h3>
                  <p className="text-text-muted">{principle.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}

      {experience.length > 0 ? (
        <Section ariaLabelledBy="experience-heading" className="pt-0 md:pt-0">
          <Container>
            <Reveal>
              <SectionHeading id="experience-heading" eyebrow="Career" heading="Experience" />
            </Reveal>
            <ol className="relative flex flex-col gap-8 md:border-l md:border-border md:pl-10">
              {experience.map((entry) => (
                <li key={entry._id} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-7 -left-[calc(2.5rem+5px)] hidden h-2.5 w-2.5 rounded-full bg-tertiary shadow-[0_0_10px_rgba(76,215,246,0.7)] md:block"
                  />
                  <Reveal className="glass flex flex-col gap-4 rounded-card p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-3">
                        {entry.logo?.assetRef ? (
                          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                            <SanityImage image={entry.logo} alt={entry.company} sizes="40px" className="object-contain p-1" />
                          </span>
                        ) : null}
                        <div>
                          <p className="font-display text-title text-text">{entry.company}</p>
                          <p className="eyebrow-sm text-tertiary">{entry.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Chip>{formatRange(entry.startDate, entry.endDate)}</Chip>
                        {entry.location ? <Chip>{entry.location}</Chip> : null}
                      </div>
                    </div>
                    <p className="text-text-muted">{entry.summary}</p>
                    {entry.impacts && entry.impacts.length > 0 ? (
                      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label={`${entry.company} impact`}>
                        {entry.impacts.slice(0, 3).map((impact) => (
                          <li key={impact._key ?? impact.label}>
                            <MetricTile metric={impact} size="sm" />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {entry.tags && entry.tags.length > 0 ? (
                      <ul className="flex flex-wrap gap-1.5">
                        {entry.tags.map((tag) => (
                          <li key={tag}>
                            <Chip>{tag}</Chip>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </Reveal>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      ) : null}

      {education.length > 0 ? (
        <Section ariaLabelledBy="education-heading" className="pt-0 md:pt-0">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12">
              <Reveal className="lg:col-span-4">
                <SectionHeading
                  id="education-heading"
                  eyebrow="Background"
                  heading="Education & credentials"
                  intro="Degrees, certifications and the programs that shaped how I work."
                />
              </Reveal>
              <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
                {education.map((item) => (
                  <StaggerItem as="li" key={item._id} className="glass flex flex-col gap-3 rounded-card p-6">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-tile bg-primary-strong/12 text-primary">
                        <Icon name={item.icon} fallback="graduation-cap" size={20} />
                      </span>
                      {item.label ? <span className="eyebrow-sm text-text-muted">{item.label}</span> : null}
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-text">{item.title}</h3>
                      <p className="text-sm text-tertiary">{item.institution}</p>
                    </div>
                    {item.text ? <p className="text-sm text-text-muted">{item.text}</p> : null}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Container>
        </Section>
      ) : null}

      {skills.length > 0 ? (
        <Section ariaLabelledBy="skills-heading" className="pt-0 md:pt-0">
          <Container>
            <Reveal>
              <SectionHeading id="skills-heading" eyebrow="Toolkit" heading="Skills & expertise" />
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li key={skill}>
                    <Chip className="px-3 py-1.5 text-sm">{skill}</Chip>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <Reveal>
        <ClosingCta
          heading={page.ctaHeading}
          body={page.ctaBody}
          badge={showAvailability ? availability?.label : null}
          primary={{ href: '/contact', label: 'Get in Touch' }}
          secondary={settings.resumeUrl ? { href: settings.resumeUrl, label: 'Download resume', external: true } : null}
          tertiary={settings.linkedinUrl ? { href: settings.linkedinUrl, label: 'LinkedIn', external: true } : null}
        />
      </Reveal>
    </>
  )
}
