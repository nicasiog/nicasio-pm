'use client'

import { motion } from 'motion/react'

type HeroItemProps = {
  children: React.ReactNode
  index: number
  className?: string
}

/**
 * Hero elements fade in one after another: badge, headline, subhead,
 * buttons, metrics, then the card, over about 0.7s total.
 */
export function HeroItem({ children, index, className }: HeroItemProps) {
  return (
    <motion.div
      className={className}
      data-reveal=""
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 * index }}
    >
      {children}
    </motion.div>
  )
}
