import 'server-only'

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { evaluate, parse } from 'groq-js'
import type { QueryParams } from 'next-sanity'

let datasetPromise: Promise<Record<string, unknown>[]> | null = null

async function loadDataset() {
  if (!datasetPromise) {
    datasetPromise = (async () => {
      const file = path.join(process.cwd(), 'seed', 'content.ndjson')
      const raw = await readFile(file, 'utf8')
      const now = new Date().toISOString()
      return raw
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .map((line) => JSON.parse(line) as Record<string, unknown>)
        .map((doc) => ({ _createdAt: now, _updatedAt: now, _rev: 'seed', ...doc }))
    })()
  }
  return datasetPromise
}

/**
 * Evaluates a GROQ query against seed/content.ndjson with groq-js. Used only
 * when Sanity is not configured (see env.ts), so the site can run locally and
 * in CI without a project.
 */
export async function seedFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  const dataset = await loadDataset()
  const tree = parse(query)
  const value = await evaluate(tree, { dataset, params })
  return (await value.get()) as T
}
