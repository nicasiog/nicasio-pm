import { defineArrayMember, defineField, defineType } from 'sanity'

export const projectsPage = defineType({
  name: 'projectsPage',
  title: 'Projects page',
  type: 'document',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'highlight',
      title: 'Highlighted phrase',
      type: 'string',
      description: 'Rendered in gradient on its own line. Must appear in the heading.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!value) return true
          const heading = (context.document as { heading?: string } | undefined)?.heading ?? ''
          return heading.includes(value) ? true : 'The highlighted phrase must appear in the heading.'
        }),
    }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      description: 'Up to 4. Leave empty to hide the row.',
      of: [defineArrayMember({ type: 'metric' })],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({ name: 'ctaHeading', title: 'CTA heading', type: 'string', initialValue: 'Want to talk through any of these?' }),
    defineField({ name: 'ctaBody', title: 'CTA body', type: 'text', rows: 2 }),
  ],
  preview: {
    prepare: () => ({ title: 'Projects page' }),
  },
})
