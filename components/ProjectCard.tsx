import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { ProjectCard as ProjectCardType } from '@/sanity/lib/types'

import { Icon } from './Icon'
import { ImageFallback, SanityImage } from './SanityImage'
import { Chip, StatusBadge } from './ui'

const MAX_STACK = 5

type ProjectCardProps = {
  project: ProjectCardType
  /** Full-width card with the image on the left (bento lead). */
  horizontal?: boolean
  priority?: boolean
}

/**
 * Whole card is one link. 16:10 image with a dark bottom vignette, context
 * eyebrow in cyan, title, optional impact chip, summary, up to 5 stack chips
 * plus "+N more", and a "View Case Study" link.
 */
export function ProjectCard({ project, horizontal = false, priority = false }: ProjectCardProps) {
  const stack = project.stack ?? []
  const visibleStack = stack.slice(0, MAX_STACK)
  const extra = stack.length - visibleStack.length

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`glass card-hover group flex h-full overflow-hidden rounded-card p-3 ${
        horizontal ? 'flex-col lg:flex-row' : 'flex-col'
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-tile ${
          horizontal ? 'aspect-[16/10] lg:aspect-auto lg:w-[55%]' : 'aspect-[16/10]'
        }`}
      >
        {project.heroImage?.assetRef ? (
          <SanityImage
            image={project.heroImage}
            sizes={horizontal ? '(min-width: 1024px) 660px, 100vw' : '(min-width: 1024px) 400px, 100vw'}
            priority={priority}
            className="transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <ImageFallback label={project.title} />
        )}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg/70 to-transparent" />
        {project.status ? (
          <div className="absolute top-3 left-3">
            <StatusBadge pulse={project.status === 'In production'}>{project.status}</StatusBadge>
          </div>
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col gap-3 p-4 ${horizontal ? 'lg:justify-center lg:px-8 lg:py-6' : 'pt-5'}`}>
        {project.context ? <p className="eyebrow-sm text-tertiary">{project.context}</p> : null}
        <h3 className={`font-display font-bold tracking-tight text-text ${horizontal ? 'text-title lg:text-headline-sm' : 'text-title'}`}>
          {project.title}
        </h3>
        {project.impact?.text ? (
          <div>
            <Chip tone="active">
              <Icon name={project.impact.icon} size={14} fallback="gauge" />
              {project.impact.text}
            </Chip>
          </div>
        ) : null}
        {project.summary ? <p className="text-text-muted">{project.summary}</p> : null}
        {visibleStack.length > 0 ? (
          <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="Stack">
            {visibleStack.map((item) => (
              <li key={item}>
                <Chip>{item}</Chip>
              </li>
            ))}
            {extra > 0 ? (
              <li>
                <Chip tone="accent">+{extra} more</Chip>
              </li>
            ) : null}
          </ul>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-2 pt-3 font-semibold text-tertiary">
          View Case Study
          <ArrowRight aria-hidden="true" size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
