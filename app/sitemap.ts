import type { MetadataRoute } from 'next'

import { sanityFetch } from '@/sanity/lib/fetch'
import { projectSlugsQuery } from '@/sanity/lib/queries'
import type { ProjectSlug } from '@/sanity/lib/types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = (await sanityFetch<ProjectSlug[]>({ query: projectSlugsQuery, tags: ['project'] })) ?? []
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = ['', '/projects', '/about', '/contact'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: project._updatedAt ? new Date(project._updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes]
}
