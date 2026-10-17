'use client'

import { motion } from 'motion/react'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

type StaggerProps = { children: React.ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' }

/** Grid/list wrapper that staggers its children by 0.06s when it scrolls into view. */
export function Stagger({ children, className, as = 'div' }: StaggerProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      data-reveal=""
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </Component>
  )
}

type StaggerItemProps = { children: React.ReactNode; className?: string; as?: 'div' | 'li' | 'article' }

export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
  const Component = motion[as]
  return (
    <Component className={className} data-reveal="" variants={item}>
      {children}
    </Component>
  )
}
