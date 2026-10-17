import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ClosingCta } from '@/components/ClosingCta'
import { Reveal } from '@/components/motion/Reveal'
import { ProjectsExplorer } from '@/components/ProjectsExplorer'
import { SetupNotice } from '@/components/SetupNotice'
import { Chip, Container, GradientHeading, MetricTile, Section } from '@/components/ui'
import { sanityFetch } from '@/sanity/lib/fetch'
import { allProjectsQuery, categoriesQuery, projectsPageQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import type { Category, ProjectCard, ProjectsPage, SiteSettings } from '@/sanity/lib/types'

const TAGS = ['projectsPage', 'project', 'category', 'siteSettings']

async function getData() {
  const [page, projects, categories, settings] = await Promise.all([
    sanityFetch<ProjectsPage | null>({ query: projectsPageQuery, tags: TAGS }),
    sanityFetch<ProjectCard[]>({ query: allProjectsQuery, tags: TAGS }),
    sanityFetch<Category[]>({ query: categoriesQuery, tags: TAGS }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: TAGS }),
  ])
  return { page, projects: projects ?? [], categories: categories ?? [], settings }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getData()
  return {
    title: 'Projects',
    description: page?.intro ?? undefined,
    alternates: { canonical: '/projects' },
    openGraph: { title: 'Projects', description: page?.intro ?? undefined },
  }
}

export default async function ProjectsIndexPage() {
  const { page, projects, categories, settings } = await getData()
  if (!page) return <SetupNotice document="projectsPage" />

  const stats = (page.stats ?? []).slice(0, 4)
  const availability = settings?.availability

  return (
    <>
      <Section ariaLabelledBy="projects-heading" className="pb-10 md:pb-12">
        <Container>
          <div className="flex max-w-3xl flex-col gap-5">
            {page.eyebrow ? (
              <div>
                <Chip tone="accent">{page.eyebrow}</Chip>
              </div>
            ) : null}
            <GradientHeading
              id="projects-heading"
              text={page.heading}
              highlight={page.highlight}
              breakBefore
              className="font-display text-display-sm text-text md:text-display"
            />
            {page.intro ? <p className="text-body-lg text-text-muted">{page.intro}</p> : null}
          </div>
          {stats.length > 0 ? (
            <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Portfolio stats">
              {stats.map((stat) => (
                <li key={stat._key ?? stat.label}>
                  <MetricTile metric={stat} />
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Container>
          <Suspense fallback={null}>
            <ProjectsExplorer projects={projects} categories={categories} />
          </Suspense>
        </Container>
      </Section>

      <Reveal>
        <ClosingCta
          heading={page.ctaHeading || 'Want to talk through any of these?'}
          body={page.ctaBody}
          badge={availability?.show && availability?.label ? availability.label : null}
          primary={{ href: '/contact', label: 'Get in Touch' }}
          secondary={{ href: '/about', label: 'About Me' }}
        />
      </Reveal>
    </>
  )
}
