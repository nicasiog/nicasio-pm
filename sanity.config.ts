'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from '@/sanity/lib/env'
import { schemaTypes } from '@/sanity/schemaTypes'
import { SINGLETON_TYPES, structure } from '@/sanity/structure'

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'portfolio',
  title: 'Portfolio',
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons never appear in the "create new document" menu.
    templates: (templates) => templates.filter((t) => !SINGLETON_TYPES.has(t.schemaType)),
  },
  document: {
    // Singletons cannot be unpublished, duplicated or deleted.
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
})
