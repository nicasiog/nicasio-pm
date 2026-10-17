import type { Metadata } from 'next'
import { MapPin } from 'lucide-react'

import { ButtonLink } from '@/components/Button'
import { ClosingCta } from '@/components/ClosingCta'
import { IconTile } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { HeroItem } from '@/components/motion/HeroSequence'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { ProjectCard } from '@/components/ProjectCard'
import { ImageFallback, SanityImage } from '@/components/SanityImage'
import { SetupNotice } from '@/components/SetupNotice'
import {
  AmbientGlow,
  Chip,
  Container,
  Eyebrow,
  GradientHeading,
  MetricTile,
  Section,
  SectionHeading,
  StatusBadge,
} from '@/components/ui'
import { sanityFetch } from '@/sanity/lib/fetch'
import { homePageQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import type { HomePage, SiteSettings } from '@/sanity/lib/types'

const TAGS = ['homePage', 'siteSettings', 'project', 'category']

async function getData() {
  const [page, settings] = await Promise.all([
    sanityFetch<HomePage | null>({ query: homePageQuery, tags: TAGS }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: TAGS }),
  ])
  return { page, settings }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page, settings } = await getData()
  const title = settings ? `${settings.name} · ${settings.role}` : 'Home'
  return {
    title: { absolute: title },
    description: page?.heroSubhead ?? settings?.metaDescription ?? undefined,
    alternates: { canonical: '/' },
  }
}

export default async function HomePage() {
  const { page, settings } = await getData()
  if (!page || !settings) return <SetupNotice document={page ? 'siteSettings' : 'homePage'} />

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const availability = settings.availability
  const showAvailability = Boolean(availability?.show && availability?.label)
  const metrics = (page.heroMetrics ?? []).slice(0, 3)
  const employers = page.employers ?? []
  const pillars = page.pillars ?? []
  const featured = (page.featuredProjects ?? []).filter(Boolean).slice(0, 4)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: settings.name,
          jobTitle: settings.role,
          url: siteUrl,
          email: `mailto:${settings.email}`,
          sameAs: [settings.linkedinUrl, settings.githubUrl].filter(Boolean),
        }}
      />

      {/* Hero */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden">
        <AmbientGlow />
        <Container className="relative pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-8">
              {showAvailability ? (
                <HeroItem index={0}>
                  <StatusBadge>{availability?.label}</StatusBadge>
                </HeroItem>
              ) : null}
              <HeroItem index={1}>
                <GradientHeading
                  id="hero-heading"
                  text={page.heroHeadline}
                  highlight={page.heroHighlight}
                  className="font-display text-display-sm text-text md:text-display"
                />
              </HeroItem>
              <HeroItem index={2}>
                <p className="max-w-2xl text-body-lg text-text-muted">{page.heroSubhead}</p>
              </HeroItem>
              <HeroItem index={3}>
                <div className="flex flex-wrap items-center gap-3">
                  {settings.resumeUrl ? (
                    <ButtonLink href={settings.resumeUrl} variant="primary" arrow="right" external>
                      View Resume
                    </ButtonLink>
                  ) : null}
                  <ButtonLink href="#featured-projects" variant="secondary" arrow="down">
                    Explore Work
                  </ButtonLink>
                </div>
              </HeroItem>
              {metrics.length > 0 ? (
                <HeroItem index={4}>
                  <ul className="grid max-w-xl grid-cols-1 gap-3 pt-2 sm:grid-cols-3" aria-label="Highlights">
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
              <div className="glass relative mx-auto flex w-full max-w-[360px] flex-col overflow-hidden rounded-card p-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-tile">
                  {page.profileImage?.assetRef ? (
                    <SanityImage image={page.profileImage} sizes="(min-width: 1024px) 336px, 90vw" priority />
                  ) : (
                    <ImageFallback label="Profile photo" />
                  )}
                </div>
                <div className="flex flex-col gap-2 px-2 pt-4 pb-2">
                  <div>
                    <p className="font-display text-title text-text">{settings.name}</p>
                    <p className="eyebrow-sm text-tertiary">{settings.role}</p>
                  </div>
                  {page.profileFocus ? <p className="text-sm text-text-muted">{page.profileFocus}</p> : null}
                  {settings.location ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
                      <MapPin size={14} aria-hidden="true" className="text-primary" />
                      {settings.location}
                    </p>
                  ) : null}
                </div>
              </div>
            </HeroItem>
          </div>
        </Container>
      </section>

      {/* Where I've worked */}
      {employers.length > 0 ? (
        <Container>
          <Reveal as="section" className="rounded-card border border-border bg-surface-2/60 px-6 py-10 text-center">
            <Eyebrow className="mb-6 tracking-[0.2em]">{page.employersLabel || 'Where I’ve worked'}</Eyebrow>
            <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-8" aria-label="Employers">
              {employers.map((employer) => (
                <li key={employer._key} className="flex items-center">
                  {employer.logo?.assetRef ? (
                    <span className="relative block h-10 w-32 opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0">
                      <SanityImage image={employer.logo} alt={employer.name} sizes="128px" className="object-contain" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-border bg-surface-2 px-4 py-2 font-display text-sm font-bold text-text">
                      {employer.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      ) : null}

      {/* Pillars */}
      {pillars.length > 0 ? (
        <Section ariaLabelledBy="pillars-heading">
          <Container>
            <Reveal>
              <SectionHeading id="pillars-heading" eyebrow={page.pillarsEyebrow} heading={page.pillarsHeading} />
            </Reveal>
            <Stagger as="ul" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pillars.map((pillar) => (
                <StaggerItem as="li" key={pillar._key} className="glass flex flex-col gap-4 rounded-card p-6 md:[&:nth-child(3)]:col-span-2 lg:[&:nth-child(3)]:col-span-1">
                  <div className="flex items-center justify-between">
                    <IconTile name={pillar.icon} />
                    <span className="eyebrow-sm text-text-muted">{pillar.label}</span>
                  </div>
                  <h3 className="font-display text-title text-text">{pillar.title}</h3>
                  {pillar.intro ? <p className="text-text-muted">{pillar.intro}</p> : null}
                  {pillar.bullets && pillar.bullets.length > 0 ? (
                    <ul className="flex flex-col gap-2.5 text-sm text-text-muted">
                      {pillar.bullets.map((bullet) => (
                        <li key={bullet} className="square-bullet">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {pillar.chips && pillar.chips.length > 0 ? (
                    <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label={`${pillar.title} tools`}>
                      {pillar.chips.map((chip) => (
                        <li key={chip}>
                          <Chip>{chip}</Chip>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}

      {/* Featured projects */}
      {featured.length > 0 ? (
        <Section id="featured-projects" ariaLabelledBy="featured-heading" className="scroll-mt-20 pt-0 md:pt-0">
          <Container>
            <Reveal>
              <SectionHeading
                id="featured-heading"
                eyebrow={page.featuredEyebrow || 'Selected work'}
                heading={page.featuredHeading || 'Featured projects'}
                intro={page.featuredIntro}
                action={
                  <ButtonLink href="/projects" variant="link" arrow="right">
                    View all
                  </ButtonLink>
                }
              />
            </Reveal>
            <Stagger as="ul" className="grid gap-6 md:grid-cols-2">
              {featured.map((project) => (
                <StaggerItem as="li" key={project._id}>
                  <ProjectCard project={project} />
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}

      <Reveal>
        <ClosingCta
          heading={page.ctaHeading}
          body={page.ctaBody}
          badge={showAvailability ? availability?.label : null}
          primary={{ href: '/contact', label: 'Get in Touch' }}
          secondary={{ href: '/about', label: 'About Me' }}
        />
      </Reveal>
    </>
  )
}
