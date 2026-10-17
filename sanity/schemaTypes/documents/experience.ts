import { defineArrayMember, defineField, defineType } from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({ name: 'company', title: 'Company', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({ name: 'role', title: 'Role', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      description: 'Leave empty for "Present".',
    }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'impacts',
      title: 'Impact tiles',
      type: 'array',
      of: [defineArrayMember({ type: 'metric' })],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
  ],
  orderings: [{ title: 'Newest first', name: 'startDesc', by: [{ field: 'startDate', direction: 'desc' }] }],
  preview: {
    select: { title: 'role', subtitle: 'company', media: 'logo' },
  },
})
