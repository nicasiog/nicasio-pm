import {
  Brain,
  Cpu,
  FlaskConical,
  Gauge,
  GraduationCap,
  Layers,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  Users,
  Workflow,
  type LucideProps,
} from 'lucide-react'

import type { IconName } from '@/sanity/schemaTypes/icons'

const icons: Record<IconName, React.ComponentType<LucideProps>> = {
  sparkles: Sparkles,
  cpu: Cpu,
  brain: Brain,
  layers: Layers,
  workflow: Workflow,
  'flask-conical': FlaskConical,
  users: Users,
  rocket: Rocket,
  gauge: Gauge,
  target: Target,
  terminal: Terminal,
  'shield-check': ShieldCheck,
  'graduation-cap': GraduationCap,
  search: Search,
}

type IconProps = Omit<LucideProps, 'name'> & { name?: IconName | string | null; fallback?: IconName }

/** Renders a lucide icon from a Sanity `icon` field value. */
export function Icon({ name, fallback = 'sparkles', ...props }: IconProps) {
  const Component = (name && icons[name as IconName]) || icons[fallback]
  return <Component aria-hidden="true" strokeWidth={1.75} {...props} />
}

/** 36px tinted tile holding an icon (spec 7, layout and shape). */
export function IconTile({ name, className = '' }: { name?: IconName | string | null; className?: string }) {
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-tile bg-primary-strong/12 text-primary ${className}`}
    >
      <Icon name={name} size={20} />
    </span>
  )
}
