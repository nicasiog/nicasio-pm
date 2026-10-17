import { defineArrayMember, defineField, defineType } from 'sanity'

import { iconOptions } from '../icons'

export const sectionHeader = defineType({
  name: 'sectionHeader',
  title: 'Section header',
  type: 'object',
  fields: [
    defineField({ name: 'number', title: 'Number', type: 'string', description: 'e.g. 01' }),
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. Diagnostic phase' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'heading', number: 'number', label: 'label' },
    prepare: ({ title, number, label }) => ({
      title,
      subtitle: [number, label].filter(Boolean).join(' // ') || 'Section header',
    }),
  },
})

export const metricGrid = defineType({
  name: 'metricGrid',
  title: 'Metric grid',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Metrics',
      type: 'array',
      of: [defineArrayMember({ type: 'metric' })],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({
      title: 'Metric grid',
      subtitle: (items as { value?: string }[] | undefined)?.map((i) => i.value).join(' · '),
    }),
  },
})

export const cardGrid = defineType({
  name: 'cardGrid',
  title: 'Card grid',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'card',
          fields: [
            defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: iconOptions } }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'text', title: 'Text', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
            defineField({ name: 'footnote', title: 'Footnote', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'footnote' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(2).max(3),
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({
      title: 'Card grid',
      subtitle: (items as { title?: string }[] | undefined)?.map((i) => i.title).join(' · '),
    }),
  },
})

export const processSteps = defineType({
  name: 'processSteps',
  title: 'Process steps',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'Short step label, e.g. Ingest' }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
            defineField({ name: 'tool', title: 'Tool', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'tool' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(3).max(5),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Process steps', subtitle: 'Process steps' }),
  },
})

export const highlightPair = defineType({
  name: 'highlightPair',
  title: 'Highlight pair',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Highlights',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'highlight',
          fields: [
            defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: iconOptions } }),
            defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'text', title: 'Text', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'eyebrow' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(2),
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({
      title: 'Highlight pair',
      subtitle: (items as { title?: string }[] | undefined)?.map((i) => i.title).join(' · '),
    }),
  },
})

export const specTable = defineType({
  name: 'specTable',
  title: 'Spec table',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'row',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'note', title: 'Note', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Spec table', subtitle: 'Spec table' }),
  },
})

export const codeBlock = defineType({
  name: 'codeBlock',
  title: 'Code',
  type: 'object',
  fields: [
    defineField({ name: 'language', title: 'Language', type: 'string', description: 'e.g. ts, python, bash' }),
    defineField({ name: 'code', title: 'Code', type: 'text', rows: 10, validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { language: 'language', code: 'code' },
    prepare: ({ language, code }) => ({
      title: (code as string | undefined)?.split('\n')[0] || 'Code',
      subtitle: language ? `Code · ${language}` : 'Code',
    }),
  },
})

export const figure = defineType({
  name: 'figure',
  title: 'Image with caption',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (Rule) => Rule.required().error('Every image needs alt text.'),
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
  preview: {
    select: { title: 'caption', subtitle: 'alt', media: 'asset' },
    prepare: ({ title, subtitle, media }) => ({ title: title || subtitle || 'Image', subtitle: 'Image', media }),
  },
})

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) =>
                  Rule.required().uri({ scheme: ['http', 'https', 'mailto'], allowRelative: true }),
              }),
              defineField({ name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: 'sectionHeader' }),
    defineArrayMember({ type: 'metricGrid' }),
    defineArrayMember({ type: 'cardGrid' }),
    defineArrayMember({ type: 'processSteps' }),
    defineArrayMember({ type: 'highlightPair' }),
    defineArrayMember({ type: 'specTable' }),
    defineArrayMember({ type: 'figure' }),
    defineArrayMember({ type: 'codeBlock' }),
  ],
})

/** Simple rich text (no custom blocks) for the bio and FAQ answers. */
export const simpleContent = defineType({
  name: 'simpleContent',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) =>
                  Rule.required().uri({ scheme: ['http', 'https', 'mailto'], allowRelative: true }),
              }),
              defineField({ name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false }),
            ],
          },
        ],
      },
    }),
  ],
})
