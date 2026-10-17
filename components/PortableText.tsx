import {
  PortableText as PortableTextRenderer,
  type PortableTextBlock,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from '@portabletext/react'

import { CardGridBlock } from './blocks/CardGridBlock'
import { CodeBlock } from './blocks/CodeBlock'
import { FigureBlock } from './blocks/FigureBlock'
import { HighlightPairBlock } from './blocks/HighlightPairBlock'
import { MetricGridBlock } from './blocks/MetricGridBlock'
import { ProcessStepsBlock } from './blocks/ProcessStepsBlock'
import { SectionHeaderBlock } from './blocks/SectionHeaderBlock'
import { SpecTableBlock } from './blocks/SpecTableBlock'

type LinkMark = { _type: 'link'; href?: string; openInNewTab?: boolean }

function LinkMarkComponent({ value, children }: PortableTextMarkComponentProps<LinkMark>) {
  const href = value?.href ?? '#'
  const external = value?.openInNewTab || /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
    >
      {children}
    </a>
  )
}

/** Prose paragraphs stay in a ~68ch column; custom blocks may run full width. */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="prose-col text-body-lg text-text-muted">{children}</p>,
    h2: ({ children }) => (
      <h2 className="prose-col pt-6 font-display text-headline-sm text-text md:text-[2rem] md:leading-10">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="prose-col pt-2 font-display text-title text-text">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="prose-col border-l-2 border-tertiary pl-5 font-display text-title font-semibold text-text">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="prose-col flex list-disc flex-col gap-2 pl-6 text-body-lg text-text-muted marker:text-tertiary">{children}</ul>,
    number: ({ children }) => (
      <ol className="prose-col flex list-decimal flex-col gap-2 pl-6 text-body-lg text-text-muted marker:font-label marker:text-tertiary">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-surface-2 px-1.5 py-0.5 font-label text-[0.85em] text-primary">{children}</code>
    ),
    link: LinkMarkComponent,
  },
  types: {
    sectionHeader: ({ value }) => <SectionHeaderBlock value={value} />,
    metricGrid: ({ value }) => <MetricGridBlock value={value} />,
    cardGrid: ({ value }) => <CardGridBlock value={value} />,
    processSteps: ({ value }) => <ProcessStepsBlock value={value} />,
    highlightPair: ({ value }) => <HighlightPairBlock value={value} />,
    specTable: ({ value }) => <SpecTableBlock value={value} />,
    figure: ({ value }) => <FigureBlock value={value} />,
    codeBlock: ({ value }) => <CodeBlock value={value} />,
  },
}

export function PortableText({ value, className = '' }: { value?: PortableTextBlock[] | null; className?: string }) {
  if (!value || value.length === 0) return null
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <PortableTextRenderer value={value} components={components} />
    </div>
  )
}
