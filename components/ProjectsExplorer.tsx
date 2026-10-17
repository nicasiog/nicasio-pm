'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import type { Category, ProjectCard as ProjectCardType } from '@/sanity/lib/types'

import { ProjectCard } from './ProjectCard'

type ProjectsExplorerProps = {
  projects: ProjectCardType[]
  categories: Category[]
}

/**
 * Category filter (segmented pills with counts) + bento grid. Filtering is
 * client-side and mirrored to `?category=` so a filtered view is shareable
 * and survives a reload.
 */
export function ProjectsExplorer({ projects, categories }: ProjectsExplorerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const requested = searchParams.get('category')

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const project of projects) {
      const slug = project.category?.slug
      if (slug) map.set(slug, (map.get(slug) ?? 0) + 1)
    }
    return map
  }, [projects])

  const usedCategories = categories.filter((c) => counts.has(c.slug))
  const active = requested && counts.has(requested) ? requested : 'all'
  const filtered = active === 'all' ? projects : projects.filter((p) => p.category?.slug === active)

  function select(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') params.delete('category')
    else params.set('category', slug)
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const options = [{ slug: 'all', title: 'All Work', count: projects.length }, ...usedCategories.map((c) => ({ slug: c.slug, title: c.title, count: counts.get(c.slug) ?? 0 }))]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
          {options.map((option) => {
            const selected = option.slug === active
            return (
              <button
                key={option.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => select(option.slug)}
                className={`eyebrow-sm inline-flex min-h-11 items-center gap-2 rounded-full border px-4 transition-colors ${
                  selected
                    ? 'border-primary-strong/40 bg-primary-strong/15 text-primary'
                    : 'border-border bg-surface-2 text-text-muted hover:border-border-hover hover:text-text'
                }`}
              >
                {option.title}
                <span className={selected ? 'text-primary/80' : 'text-text-muted'}>({option.count})</span>
              </button>
            )
          })}
        </div>
        <p className="text-sm text-text-muted md:text-right" aria-live="polite">
          Showing {filtered.length} of {projects.length}
        </p>
      </div>

      <h2 className="sr-only">All projects</h2>
      {filtered.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-6">
          {filtered.map((project, index) => {
            const lead = index === 0
            const pair = index === 1 || index === 2
            const span = lead ? 'md:col-span-6' : pair ? 'md:col-span-3' : 'md:col-span-3 lg:col-span-2'
            return (
              <li key={project._id} className={span}>
                <ProjectCard project={project} horizontal={lead} priority={lead} />
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="glass rounded-card p-8 text-center text-text-muted">No projects in this category yet.</p>
      )}
    </div>
  )
}
