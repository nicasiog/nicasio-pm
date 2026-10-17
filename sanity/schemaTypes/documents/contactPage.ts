import { defineArrayMember, defineField, defineType } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'highlight',
      title: 'Highlighted phrase',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!value) return true
          const heading = (context.document as { heading?: string } | undefined)?.heading ?? ''
          return heading.includes(value) ? true : 'The highlighted phrase must appear in the heading.'
        }),
    }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({ name: 'formHeading', title: 'Form heading', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'formIntro', title: 'Form helper line', type: 'string' }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      description: 'Options in the form’s Topic dropdown.',
      of: [defineArrayMember({ type: 'string' })],
      initialValue: ['Full-time role', 'Advisory', 'Just saying hi'],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'simpleContent', validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'question' } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Contact' }),
  },
})
