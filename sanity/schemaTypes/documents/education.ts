import { defineField, defineType } from 'sanity'

import { iconOptions } from '../icons'

export const education = defineType({
  name: 'education',
  title: 'Education & credentials',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'institution', title: 'Institution', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'text', title: 'One line', type: 'string' }),
    defineField({ name: 'label', title: 'Small label', type: 'string', description: 'e.g. 2024 or Certification' }),
    defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: iconOptions } }),
    defineField({ name: 'order', title: 'Order', type: 'number', validation: (Rule) => Rule.required().integer() }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'institution' },
  },
})
