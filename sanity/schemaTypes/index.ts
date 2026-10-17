import type { SchemaTypeDefinition } from 'sanity'

import { aboutPage } from './documents/aboutPage'
import { category } from './documents/category'
import { contactPage } from './documents/contactPage'
import { education } from './documents/education'
import { experience } from './documents/experience'
import { homePage } from './documents/homePage'
import { project } from './documents/project'
import { projectsPage } from './documents/projectsPage'
import { siteSettings } from './documents/siteSettings'
import {
  blockContent,
  cardGrid,
  codeBlock,
  figure,
  highlightPair,
  metricGrid,
  processSteps,
  sectionHeader,
  simpleContent,
  specTable,
} from './objects/blocks'
import { imageWithAlt } from './objects/imageWithAlt'
import { metric } from './objects/metric'

export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  siteSettings,
  homePage,
  projectsPage,
  aboutPage,
  contactPage,
  project,
  category,
  experience,
  education,
  // objects
  imageWithAlt,
  metric,
  sectionHeader,
  metricGrid,
  cardGrid,
  processSteps,
  highlightPair,
  specTable,
  figure,
  codeBlock,
  blockContent,
  simpleContent,
]
