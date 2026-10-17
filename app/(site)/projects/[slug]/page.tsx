import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, ExternalLink, GitBranch } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ButtonLink } from '@/components/Button'
import { ClosingCta } from '@/components/ClosingCta'
import { Reveal } from '@/components/motion/Reveal'
import { PortableText } from '@/components/PortableText'
import { ImageFallback, SanityImage } from '@/components/SanityImage'
import { Chip, Container, StatusBadge } from '@/components/ui'
import { sanityFetch } from '@/sanity/lib/fetch'
import { ogImageUrl } from '@/sanity/lib/image'
import { projectBySlugQuery, projectNeighboursQuery, projectSlugsQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import type { Project, ProjectNeighbour, ProjectSlug, SiteSettings } from '@/sanity/lib/types'

const TAGS = ['project', 'category', 'siteSettings']

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const slugs = await sanityFetch<ProjectSlug[]>({ query: projectSlugsQuery, tags: ['project'] })
  return (slugs ?? []).map(({ slug }) => ({ slug }))
}

async function getProject(slug: string) {
  return sanityFetch<Project | null>({ query: projectBySlugQuery, params: { slug }, tags: TAGS })
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Project not found' }
  const title = project.seoTitle || project.title
  const description = project.seoDescription || project.summary || undefined
  const image = ogImageUrl(project.heroImage)
  return {
    title,
    description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      images: image ? [{ url: image, width: 1200, height: 630, alt: project.heroImage?.alt ?? title }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  }
}

type MetaTile = { label: string; value?: string | null; detail?: string | null }

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params
  const [project, neighbours, settings] = await Promise.all([
    getProject(slug),
    sanityFetch<ProjectNeighbour[]>({ query: projectNeighboursQuery, tags: ['project'] }),
    sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: ['siteSettings'] }),
  ])
  if (!project) notFound()

  const ordered = neighbours ?? []
  const index = ordered.findIndex((p) => p._id === project._id)
  const previous = ordered.length > 1 ? ordered[(index - 1 + ordered.length) % ordered.length] : null
  const next = ordered.length > 1 ? ordered[(index + 1) % ordered.length] : null

  const tiles: MetaTile[] = [
    { label: 'Role', value: project.role, detail: project.roleDetail },
    { label: 'Timeline', value: project.timeline, detail: project.timelineDetail },
    { label: 'Stack', value: project.stack?.length ? project.stack.slice(0, 4).join(', ') : null, detail: project.stack && project.stack.length > 4 ? `+${project.stack.length - 4} more` : null },
    { label: 'Primary outcome', value: project.outcome, detail: project.outcomeDetail },
  ].filter((tile) => Boolean(tile.value))

  const tags = project.tags ?? []
  const availability = settings?.availability

  return (
    <article>
      <Container className="pt-10 md:pt-16">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <li>
              <Link href="/projects" className="inline-flex min-h-11 items-center transition-colors hover:text-text">
                Projects
              </Link>
            </li>
            {project.context ? (
              <>
                <li aria-hidden="true">/</li>
                <li className="inline-flex min-h-11 items-center">{project.context}</li>
              </>
            ) : null}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="inline-flex min-h-11 items-center text-text">
              {project.title}
            </li>
          </ol>
        </nav>

        <header className="flex max-w-4xl flex-col gap-5">
          {tags.length > 0 || project.status ? (
            <div className="flex flex-wrap items-center gap-2">
              {project.status ? <StatusBadge pulse={project.status === 'In production'}>{project.status}</StatusBadge> : null}
              {tags.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          ) : null}
          <h1 className="font-display text-display-sm text-text md:text-[3rem] md:leading-[3.5rem]">
            {project.headline || project.title}
          </h1>
          {project.summary ? <p className="text-body-lg text-text-muted">{project.summary}</p> : null}
          {project.codeUrl || project.liveUrl ? (
            <div className="flex flex-wrap gap-3">
              {project.liveUrl ? (
                <ButtonLink href={project.liveUrl} variant="secondary" arrow="external" external icon={<ExternalLink size={16} aria-hidden="true" />}>
                  Live product
                </ButtonLink>
              ) : null}
              {project.codeUrl ? (
                <ButtonLink href={project.codeUrl} variant="secondary" arrow="external" external icon={<GitBranch size={16} aria-hidden="true" />}>
                  Source code
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </header>

        {tiles.length > 0 ? (
          <dl className={`mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 ${tiles.length >= 4 ? 'lg:grid-cols-4' : tiles.length === 3 ? 'lg:grid-cols-3' : ''}`}>
            {tiles.map((tile) => (
              <div key={tile.label} className="glass flex flex-col gap-1 rounded-tile px-5 py-4">
                <dt className="eyebrow-sm text-text-muted">{tile.label}</dt>
                <dd className="flex flex-col">
                  <span className="font-display text-base font-semibold text-text">{tile.value}</span>
                  {tile.detail ? <span className="text-sm text-text-muted">{tile.detail}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="glass mt-10 rounded-card p-3">
          <div className="relative aspect-video overflow-hidden rounded-tile">
            {project.heroImage?.assetRef ? (
              <SanityImage image={project.heroImage} sizes="(min-width: 1248px) 1200px, 100vw" priority />
            ) : (
              <ImageFallback label={project.title} />
            )}
          </div>
        </div>
      </Container>

      <Container className="py-16 md:py-24">
        <PortableText value={project.body} className="mx-auto max-w-4xl" />
      </Container>

      {previous && next ? (
        <Container className="pb-16 md:pb-24">
          <nav aria-label="More projects" className="grid gap-4 md:grid-cols-2">
            <Link href={`/projects/${previous.slug}`} className="glass card-hover flex flex-col gap-2 rounded-card p-6">
              <span className="eyebrow-sm inline-flex items-center gap-2 text-tertiary">
                <ArrowLeft size={14} aria-hidden="true" /> Previous project
              </span>
              <span className="font-display text-title text-text">{previous.title}</span>
              {previous.summary ? <span className="line-clamp-2 text-sm text-text-muted">{previous.summary}</span> : null}
            </Link>
            <Link href={`/projects/${next.slug}`} className="glass card-hover flex flex-col gap-2 rounded-card p-6 md:items-end md:text-right">
              <span className="eyebrow-sm inline-flex items-center gap-2 text-tertiary">
                Next project <ArrowRight size={14} aria-hidden="true" />
              </span>
              <span className="font-display text-title text-text">{next.title}</span>
              {next.summary ? <span className="line-clamp-2 text-sm text-text-muted">{next.summary}</span> : null}
            </Link>
          </nav>
        </Container>
      ) : null}

      <Reveal>
        <ClosingCta
          heading="Want to talk through this project?"
          body="I can walk through the decisions, what the data said, and what I’d change next time."
          badge={availability?.show && availability?.label ? availability.label : null}
          primary={{ href: '/contact', label: 'Get in Touch' }}
          secondary={{ href: '/projects', label: 'All projects' }}
        />
      </Reveal>
    </article>
  )
}
