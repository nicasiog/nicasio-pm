import { defineArrayMember, defineField, defineType } from 'sanity'

import { iconOptions } from '../icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'employers', title: 'Employers' },
    { name: 'pillars', title: 'Pillars' },
    { name: 'projects', title: 'Featured projects' },
    { name: 'cta', title: 'Closing CTA' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Headline',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroHighlight',
      title: 'Highlighted phrase',
      type: 'string',
      group: 'hero',
      description: 'Rendered in the violet-to-cyan gradient. Must appear in the headline.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!value) return true
          const headline = (context.document as { heroHeadline?: string } | undefined)?.heroHeadline ?? ''
          return headline.includes(value) ? true : 'The highlighted phrase must appear in the headline.'
        }),
    }),
    defineField({
      name: 'heroSubhead',
      title: 'Subhead',
      type: 'text',
      rows: 3,
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroMetrics',
      title: 'Metrics',
      type: 'array',
      group: 'hero',
      description: 'Up to 3. Leave empty to hide the row. Only add numbers you can defend.',
      of: [defineArrayMember({ type: 'metric' })],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile photo',
      type: 'imageWithAlt',
      group: 'hero',
      description: '4:5 portrait. Use the hotspot to keep your face in frame.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profileFocus',
      title: 'Focus statement',
      type: 'string',
      group: 'hero',
      description: 'One line under your name on the profile card.',
    }),
    defineField({
      name: 'employersLabel',
      title: 'Employers label',
      type: 'string',
      group: 'employers',
      initialValue: 'Where I’ve worked',
    }),
    defineField({
      name: 'employers',
      title: 'Where I’ve worked',
      type: 'array',
      group: 'employers',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'employer',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              description: 'Optional. A name pill is shown when no logo is uploaded.',
            }),
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        }),
      ],
    }),
    defineField({ name: 'pillarsEyebrow', title: 'Pillars eyebrow', type: 'string', group: 'pillars' }),
    defineField({
      name: 'pillarsHeading',
      title: 'Pillars heading',
      type: 'string',
      group: 'pillars',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pillars',
      title: 'Pillars',
      type: 'array',
      group: 'pillars',
      description: 'Exactly three: what you do, what you use, what to expect.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pillar',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: { list: iconOptions },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. 01 // Domain',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'intro', title: 'Intro', type: 'string' }),
            defineField({
              name: 'bullets',
              title: 'Bullets',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              validation: (Rule) => Rule.required().min(1).max(6),
            }),
            defineField({
              name: 'chips',
              title: 'Chips',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'label' } },
        }),
      ],
      validation: (Rule) => Rule.required().length(3).error('Add exactly three pillars.'),
    }),
    defineField({ name: 'featuredEyebrow', title: 'Featured eyebrow', type: 'string', group: 'projects', initialValue: 'Selected work' }),
    defineField({ name: 'featuredHeading', title: 'Featured heading', type: 'string', group: 'projects', initialValue: 'Featured projects' }),
    defineField({ name: 'featuredIntro', title: 'Featured intro', type: 'text', rows: 2, group: 'projects' }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured projects',
      type: 'array',
      group: 'projects',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
      validation: (Rule) => Rule.max(4).unique(),
    }),
    defineField({
      name: 'ctaHeading',
      title: 'CTA heading',
      type: 'string',
      group: 'cta',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'ctaBody', title: 'CTA body', type: 'text', rows: 2, group: 'cta' }),
  ],
  preview: {
    prepare: () => ({ title: 'Home' }),
  },
})
