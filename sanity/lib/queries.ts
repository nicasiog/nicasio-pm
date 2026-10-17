import { defineQuery } from 'next-sanity'

const imageFields = /* groq */ `
  ...,
  alt,
  "assetRef": asset._ref,
  "lqip": asset->metadata.lqip,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
`

const siteSettingsFields = /* groq */ `
  name,
  monogram,
  role,
  metaDescription,
  "ogImage": ogImage{ ${imageFields} },
  email,
  linkedinUrl,
  githubUrl,
  "resumeUrl": resumeFile.asset->url,
  location,
  bookingUrl,
  footerBio,
  availability
`

const projectCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  context,
  "category": category->{ title, "slug": slug.current, order },
  status,
  summary,
  impact,
  "heroImage": heroImage{ ${imageFields} },
  stack,
  order
`

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]{ ${siteSettingsFields} }`)

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  heroHeadline,
  heroHighlight,
  heroSubhead,
  heroMetrics,
  "profileImage": profileImage{ ${imageFields} },
  profileFocus,
  employersLabel,
  "employers": employers[]{ _key, name, "logo": logo{ ${imageFields} } },
  pillarsEyebrow,
  pillarsHeading,
  "pillars": pillars[]{ _key, icon, label, title, intro, bullets, chips },
  featuredEyebrow,
  featuredHeading,
  featuredIntro,
  "featuredProjects": featuredProjects[]->{ ${projectCardFields} },
  ctaHeading,
  ctaBody
}`)

export const projectsPageQuery = defineQuery(`*[_type == "projectsPage"][0]{
  eyebrow,
  heading,
  highlight,
  intro,
  stats,
  ctaHeading,
  ctaBody
}`)

export const allProjectsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc){
  ${projectCardFields}
}`)

export const categoriesQuery = defineQuery(`*[_type == "category"] | order(order asc){
  _id,
  title,
  "slug": slug.current,
  order
}`)

export const projectSlugsQuery = defineQuery(`*[_type == "project" && defined(slug.current)]{
  "slug": slug.current,
  _updatedAt
}`)

export const projectBySlugQuery = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  ${projectCardFields},
  headline,
  tags,
  role,
  roleDetail,
  timeline,
  timelineDetail,
  outcome,
  outcomeDetail,
  codeUrl,
  liveUrl,
  seoTitle,
  seoDescription,
  _updatedAt,
  body[]{
    ...,
    _type == "figure" => { ${imageFields} },
    markDefs[]{ ... }
  }
}`)

/** Ordered list used for previous/next navigation. */
export const projectNeighboursQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc){
  _id,
  title,
  "slug": slug.current,
  summary
}`)

export const aboutPageQuery = defineQuery(`*[_type == "aboutPage"][0]{
  heading,
  highlight,
  intro,
  metrics,
  "photo": photo{ ${imageFields} },
  coreStack,
  bio[]{ ..., markDefs[]{ ... } },
  "principles": principles[]{ _key, icon, label, title, text },
  skills,
  ctaHeading,
  ctaBody
}`)

export const experienceQuery = defineQuery(`*[_type == "experience"] | order(startDate desc){
  _id,
  company,
  "logo": logo{ ${imageFields} },
  role,
  startDate,
  endDate,
  location,
  summary,
  impacts,
  tags
}`)

export const educationQuery = defineQuery(`*[_type == "education"] | order(order asc){
  _id,
  title,
  institution,
  text,
  label,
  icon,
  order
}`)

export const contactPageQuery = defineQuery(`*[_type == "contactPage"][0]{
  heading,
  highlight,
  intro,
  formHeading,
  formIntro,
  topics,
  "faq": faq[]{ _key, question, answer[]{ ..., markDefs[]{ ... } } }
}`)
