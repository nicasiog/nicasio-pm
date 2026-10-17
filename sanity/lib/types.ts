import type { PortableTextBlock } from '@portabletext/react'

import type { IconName } from '@/sanity/schemaTypes/icons'

export type SanityImage = {
  _type?: string
  asset?: { _ref: string; _type?: string }
  assetRef?: string | null
  alt?: string | null
  hotspot?: { x: number; y: number; height: number; width: number } | null
  crop?: { top: number; bottom: number; left: number; right: number } | null
  lqip?: string | null
  width?: number | null
  height?: number | null
}

export type Metric = { _key?: string; value: string; label: string; note?: string | null }

export type Availability = {
  show?: boolean | null
  label?: string | null
  targetRoles?: string | null
  details?: string | null
  workStyle?: string | null
} | null

export type SiteSettings = {
  name: string
  monogram: string
  role: string
  metaDescription?: string | null
  ogImage?: SanityImage | null
  email: string
  linkedinUrl?: string | null
  githubUrl?: string | null
  resumeUrl?: string | null
  location?: string | null
  bookingUrl?: string | null
  footerBio?: string | null
  availability?: Availability
}

export type Category = { _id?: string; title: string; slug: string; order?: number | null }

export type ProjectCard = {
  _id: string
  title: string
  slug: string
  context?: string | null
  category?: Category | null
  status?: 'Shipped' | 'In production' | 'Personal project' | null
  summary?: string | null
  impact?: { icon?: IconName | null; text?: string | null } | null
  heroImage?: SanityImage | null
  stack?: string[] | null
  order?: number | null
}

export type Project = ProjectCard & {
  headline?: string | null
  tags?: string[] | null
  role?: string | null
  roleDetail?: string | null
  timeline?: string | null
  timelineDetail?: string | null
  outcome?: string | null
  outcomeDetail?: string | null
  codeUrl?: string | null
  liveUrl?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  _updatedAt?: string
  body?: PortableTextBlock[] | null
}

export type ProjectNeighbour = { _id: string; title: string; slug: string; summary?: string | null }

export type Pillar = {
  _key: string
  icon: IconName
  label: string
  title: string
  intro?: string | null
  bullets?: string[] | null
  chips?: string[] | null
}

export type Employer = { _key: string; name: string; logo?: SanityImage | null }

export type HomePage = {
  heroHeadline: string
  heroHighlight?: string | null
  heroSubhead: string
  heroMetrics?: Metric[] | null
  profileImage?: SanityImage | null
  profileFocus?: string | null
  employersLabel?: string | null
  employers?: Employer[] | null
  pillarsEyebrow?: string | null
  pillarsHeading: string
  pillars?: Pillar[] | null
  featuredEyebrow?: string | null
  featuredHeading?: string | null
  featuredIntro?: string | null
  featuredProjects?: ProjectCard[] | null
  ctaHeading: string
  ctaBody?: string | null
}

export type ProjectsPage = {
  eyebrow?: string | null
  heading: string
  highlight?: string | null
  intro?: string | null
  stats?: Metric[] | null
  ctaHeading?: string | null
  ctaBody?: string | null
}

export type Principle = { _key: string; icon?: IconName | null; label?: string | null; title: string; text: string }

export type AboutPage = {
  heading: string
  highlight?: string | null
  intro?: string | null
  metrics?: Metric[] | null
  photo?: SanityImage | null
  coreStack?: string[] | null
  bio?: PortableTextBlock[] | null
  principles?: Principle[] | null
  skills?: string[] | null
  ctaHeading: string
  ctaBody?: string | null
}

export type Experience = {
  _id: string
  company: string
  logo?: SanityImage | null
  role: string
  startDate: string
  endDate?: string | null
  location?: string | null
  summary: string
  impacts?: Metric[] | null
  tags?: string[] | null
}

export type Education = {
  _id: string
  title: string
  institution: string
  text?: string | null
  label?: string | null
  icon?: IconName | null
  order?: number | null
}

export type FaqItem = { _key: string; question: string; answer: PortableTextBlock[] }

export type ContactPage = {
  heading: string
  highlight?: string | null
  intro?: string | null
  formHeading: string
  formIntro?: string | null
  topics?: string[] | null
  faq?: FaqItem[] | null
}

export type ProjectSlug = { slug: string; _updatedAt: string }
