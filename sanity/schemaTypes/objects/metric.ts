import { defineField, defineType } from 'sanity'

export const metric = defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  fields: [
    defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'note', title: 'Note', type: 'string' }),
  ],
  preview: {
    select: { title: 'value', subtitle: 'label' },
  },
})
