import { defineArrayMember, defineField, defineType } from 'sanity'

import { iconOptions } from '../icons'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'bio', title: 'Bio' },
    { name: 'principles', title: 'Principles' },
    { name: 'skills', title: 'Skills' },
    { name: 'cta', title: 'Closing CTA' },
  ],
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', group: 'hero', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'highlight',
      title: 'Highlighted phrase',
      type: 'string',
      group: 'hero',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!value) return true
          const heading = (context.document as { heading?: string } | undefined)?.heading ?? ''
          return heading.includes(value) ? true : 'The highlighted phrase must appear in the heading.'
        }),
    }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3, group: 'hero' }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      group: 'hero',
      of: [defineArrayMember({ type: 'metric' })],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'imageWithAlt',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coreStack',
      title: 'Core stack',
      type: 'array',
      group: 'hero',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'simpleContent',
      group: 'bio',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'principles',
      title: 'Principles',
      type: 'array',
      group: 'principles',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'principle',
          fields: [
            defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: iconOptions } }),
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. 01' }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'text', title: 'Text', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'label' } },
        }),
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'skills',
      title: 'Skills & expertise',
      type: 'array',
      group: 'skills',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'ctaHeading', title: 'CTA heading', type: 'string', group: 'cta', validation: (Rule) => Rule.required() }),
    defineField({ name: 'ctaBody', title: 'CTA body', type: 'text', rows: 2, group: 'cta' }),
  ],
  preview: {
    prepare: () => ({ title: 'About' }),
  },
})
